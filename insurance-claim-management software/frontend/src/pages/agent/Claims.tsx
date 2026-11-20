"use client"

import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getAllClaims } from "@/services/api"
import { Search, ClipboardList } from "lucide-react"

const STATUS_COLOR: Record<string, string> = {
  SUBMITTED: "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300",
  UNDER_REVIEW: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300",
  RECOMMENDED_FOR_APPROVAL: "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300",
  RECOMMENDED_FOR_REJECTION: "bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300",
  APPROVED: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
  REJECTED: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300",
}

export default function AgentClaims() {
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const { data, isLoading } = useQuery({
    queryKey: ["agent-claims"],
    queryFn: async () => { const r = await getAllClaims({ page: 1, size: 100 }); return r.data.data.records },
  })

  const term = search.trim().toLowerCase()
  const rows = (data || []).filter((c: any) =>
    !term || [c.claimNumber, c.customerName, c.policyNumber].join(" ").toLowerCase().includes(term)
  )

  if (isLoading) return <div className="flex h-[400px] items-center justify-center"><div className="h-8 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Claims</h1>
          <p className="text-gray-600 dark:text-gray-300">View all claims.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-400" />
          <Input placeholder="Search claims..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>
      <Card>
        <CardHeader><CardTitle>Claims</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Policy</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(rows || []).map((c: any) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-sm">{c.claimNumber}</TableCell>
                    <TableCell>{c.customerName}</TableCell>
                    <TableCell>{c.policyNumber}</TableCell>
                    <TableCell>₹{c.claimAmount?.toLocaleString()}</TableCell>
                    <TableCell><Badge className={STATUS_COLOR[c.claimStatus] || "bg-gray-100 dark:bg-gray-800"}>{c.claimStatus.replace(/_/g, " ")}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" asChild><Link to={`/agent/claims/${c.id}`}>View</Link></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(rows || []).length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">No claims found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
