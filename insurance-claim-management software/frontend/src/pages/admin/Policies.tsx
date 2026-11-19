"use client"

import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getAllPolicies } from "@/services/api"
import { Search, FileText } from "lucide-react"

const STATUS_COLOR: Record<string, string> = {
  PENDING_PAYMENT: "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300",
  ACTIVE: "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300",
  EXPIRED: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100",
  CANCELLED: "bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300",
}

export default function AdminPolicies() {
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const { data, isLoading } = useQuery({
    queryKey: ["all-policies", statusFilter],
    queryFn: async () => {
      const res = await getAllPolicies({ page: 1, size: 100, status: statusFilter })
      return res.data.data.records
    },
  })

  const term = search.trim().toLowerCase()
  const rows = (data || []).filter((p: any) =>
    !term || [p.policyNumber, p.customerName, p.planName].join(" ").toLowerCase().includes(term)
  )

  if (isLoading) return <div className="flex h-[400px] items-center justify-center"><div className="h-8 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">All Policies</h1>
          <p className="text-gray-600 dark:text-gray-300">View and manage all issued policies.</p>
        </div>
        <div className="flex items-center gap-2">
          <Input placeholder="Search policies..." value={search} onChange={(e) => setSearch(e.target.value)} />
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800">
            <option value="">All Status</option>
            <option value="PENDING_PAYMENT">Pending Payment</option>
            <option value="ACTIVE">Active</option>
            <option value="EXPIRED">Expired</option>
            <option value="CANCELLED">Cancelled</option>
          </select>
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
                  <TableHead>Customer</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Coverage</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(rows || []).map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-sm">{p.policyNumber}</TableCell>
                    <TableCell>{p.customerName}</TableCell>
                    <TableCell>{p.planName}</TableCell>
                    <TableCell className="text-sm">{p.productType}</TableCell>
                    <TableCell>₹{p.coverageAmount?.toLocaleString()}</TableCell>
                    <TableCell><Badge className={STATUS_COLOR[p.policyStatus] || "bg-gray-100 dark:bg-gray-800"}>{p.policyStatus.replace(/_/g, " ")}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" asChild><Link to={`/admin/policies/${p.id}`}>View</Link></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(rows || []).length === 0 && (
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

