"use client"

import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getMyClaims, getClaimById } from "@/services/api"
import { ClipboardList, FileText, ChevronRight } from "lucide-react"

const STATUS_COLOR: Record<string, string> = {
  SUBMITTED: "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300",
  UNDER_REVIEW: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300",
  RECOMMENDED_FOR_APPROVAL: "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300",
  RECOMMENDED_FOR_REJECTION: "bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300",
  APPROVED: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
  REJECTED: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300",
}

export default function CustomerClaims() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ["my-claims"],
    queryFn: async () => {
      const res = await getMyClaims({ page: 1, size: 50 })
      return res.data.data.records
    },
  })

  if (isLoading) return <div className="flex h-[400px] items-center justify-center"><div className="h-8 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Claims</h1>
          <p className="text-gray-600 dark:text-gray-300">Track your submitted claims.</p>
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
                  <TableHead>Policy</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data || []).map((c: any) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-sm">{c.claimNumber}</TableCell>
                    <TableCell>{c.policyNumber}</TableCell>
                    <TableCell>₹{c.claimAmount?.toLocaleString()}</TableCell>
                    <TableCell><Badge className={STATUS_COLOR[c.claimStatus] || "bg-gray-100 dark:bg-gray-800"}>{c.claimStatus.replace(/_/g, " ")}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" asChild><Link to={`/customer/claims/${c.id}`}>View</Link></Button>
                    </TableCell>
                  </TableRow>
                ))}
                {(data || []).length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">No claims found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
