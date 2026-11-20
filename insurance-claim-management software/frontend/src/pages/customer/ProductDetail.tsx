"use client"

import React, { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getPublicProducts, getPlans, purchasePolicy } from "@/services/api"
import { Shield, ArrowLeft, FileText, RefreshCw } from "lucide-react"

const STATUS_COLOR: Record<string, string> = {
  PENDING_PAYMENT: "bg-amber-100 text-amber-800",
  ACTIVE: "bg-emerald-100 text-emerald-800",
  EXPIRED: "bg-gray-100 text-gray-800",
  CANCELLED: "bg-rose-100 text-rose-800",
}

export default function CustomerProductDetail() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { id: productId } = useParams()
  const pid = Number(productId)

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["product-detail", pid],
    queryFn: async () => {
      const res = await getPublicProducts({ page: 1, size: 1 })
      const found = (res.data.data.records || []).find((p: any) => p.id === pid)
      if (!found) throw new Error("Product not found")
      return found
    },
    enabled: !!pid,
  })

  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ["product-plans", pid],
    queryFn: async () => {
      const res = await getPlans({ page: 1, size: 50, productId: pid })
      return res.data.data.records
    },
    enabled: !!pid,
  })

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [startDate, setStartDate] = useState("")

  const purchaseMut = useMutation({
    mutationFn: purchasePolicy,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-policies"] })
      toast({ title: "Policy purchased", description: "Your policy has been created with Pending Payment status." })
      setSelectedPlan(null)
      setStartDate("")
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Purchase failed", description: e.response?.data?.message }),
  })

  if (productLoading || plansLoading) {
    return <div className="flex h-[600px] items-center justify-center"><div className="h-8 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" /></div>
  }

  if (!product) {
    return <div className="flex h-[600px] items-center justify-center"><p className="text-gray-500">Product not found.</p></div>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link to="/customer/browse" className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
            <ArrowLeft size={16} /> Back to Products
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">{product.productName}</h1>
          <p className="text-gray-600 dark:text-gray-300">{product.description}</p>
        </div>
        <Badge variant="outline">{product.productType}</Badge>
      </div>

      <Card>
        <CardHeader><CardTitle>Available Plans</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Coverage</TableHead>
                  <TableHead>Premium</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(plans || []).filter((p: any) => p.active).map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.planName}</TableCell>
                    <TableCell>₹{p.coverageAmount?.toLocaleString()}</TableCell>
                    <TableCell>₹{p.premiumAmount?.toLocaleString()}</TableCell>
                    <TableCell className="text-sm">{p.premiumType}</TableCell>
                    <TableCell className="text-sm">{p.durationYears} year{(p.durationYears || 1) > 1 ? "s" : ""}</TableCell>
                    <TableCell className="text-right">
                      {selectedPlan === String(p.id) ? (
                        <div className="flex items-center gap-2">
                          <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="h-8 text-xs" />
                          <Button size="sm" onClick={() => {
                            if (!startDate) { toast({ variant: "destructive", title: "Missing date", description: "Please select a start date." }); return }
                            purchaseMut.mutate({ planId: p.id, startDate })
                          }} disabled={purchaseMut.isPending || !startDate}>
                            Purchase
                          </Button>
                        </div>
                      ) : (
                        <Button size="sm" onClick={() => setSelectedPlan(String(p.id))}>
                          Purchase
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {(plans || []).filter((p: any) => p.active).length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">No active plans available for this product.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { Input } from "@/components/ui/input"
