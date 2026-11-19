"use client"

import React, { useEffect, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getMyPolicies, recordPayment, getMyPayments } from "@/services/api"
import { Plus, CreditCard, FileText, RefreshCw } from "lucide-react"

const STATUS_COLOR: Record<string, string> = {
  PENDING_PAYMENT: "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300",
  ACTIVE: "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300",
  EXPIRED: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100",
  CANCELLED: "bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300",
}

export default function CustomerPolicies() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ["my-policies"],
    queryFn: async () => {
      const res = await getMyPolicies({ page: 1, size: 50 })
      return res.data.data.records
    },
  })

  const payMut = useMutation({
    mutationFn: recordPayment,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["my-policies"] }); toast({ title: "Recorded", description: "Payment recorded (simulated)." }) },
    onError: (e: any) => toast({ variant: "destructive", title: "Error", description: e.response?.data?.message }),
  })

  if (isLoading) return <div className="flex h-[400px] items-center justify-center"><div className="h-8 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Policies</h1>
          <p className="text-gray-600 dark:text-gray-300">Your insurance policies and coverage.</p>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Policies</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy #</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Coverage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Premium Paid</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data || []).map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-sm">{p.policyNumber}</TableCell>
                    <TableCell>{p.planName}</TableCell>
                    <TableCell className="text-sm">{p.productType}</TableCell>
                    <TableCell>₹{p.coverageAmount?.toLocaleString()}</TableCell>
                    <TableCell><Badge className={STATUS_COLOR[p.policyStatus] || "bg-gray-100 dark:bg-gray-800"}>{p.policyStatus.replace(/_/g, " ")}</Badge></TableCell>
                    <TableCell>₹{p.totalPremiumPaid?.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {p.policyStatus === "PENDING_PAYMENT" && (
                        <Button size="sm" onClick={() => payMut.mutate({ policyId: p.id, amount: p.premiumAmount, paymentMode: "UPI", transactionReference: `TXN-${Date.now()}`, paymentStatus: "SUCCESS" })}>
                          <RefreshCw size={16} /> Pay Premium
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {(data || []).length === 0 && (
                  <TableRow><TableCell colSpan={7} className="text-center py-8 text-gray-500 dark:text-gray-400">No policies found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
