"use client"

import React, { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getAllPayments } from "@/services/api"
import { Search, CreditCard } from "lucide-react"

const STATUS_COLOR: Record<string, string> = {
  SUCCESS: "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300",
  FAILED: "bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300",
  PENDING: "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300",
}

export default function AdminPayments() {
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const { data, isLoading } = useQuery({
    queryKey: ["all-payments"],
    queryFn: async () => {
      const res = await getAllPayments({ page: 1, size: 100 })
      return res.data.data.records
    },
  })

  const term = search.trim().toLowerCase()
  const rows = (data || []).filter((p: any) =>
    !term || [p.policyNumber, p.transactionReference, p.paymentMode, p.paymentStatus].join(" ").toLowerCase().includes(term)
  )

  if (isLoading) return <div className="flex h-[400px] items-center justify-center"><div className="h-8 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Premium Payments</h1>
          <p className="text-gray-600 dark:text-gray-300">View all simulated premium payments.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-400" />
          <Input placeholder="Search payments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Payment Records</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy #</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(rows || []).map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-sm">{p.policyNumber}</TableCell>
                    <TableCell>₹{p.amount?.toLocaleString()}</TableCell>
                    <TableCell className="text-sm">{p.paymentDate}</TableCell>
                    <TableCell>{p.paymentMode}</TableCell>
                    <TableCell className="text-xs">{p.transactionReference}</TableCell>
                    <TableCell><Badge className={STATUS_COLOR[p.paymentStatus] || "bg-gray-100 dark:bg-gray-800"}>{p.paymentStatus}</Badge></TableCell>
                  </TableRow>
                ))}
                {(rows || []).length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">No payments found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
