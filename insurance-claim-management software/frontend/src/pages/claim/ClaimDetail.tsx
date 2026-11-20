"use client"

import React, { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { getClaimById, getClaimDocuments, getClaimHistory } from "@/services/api"
import { useAuth } from "@/context/AuthContext"
import { FileText, Clock, ShieldCheck, User } from "lucide-react"

const STATUS_COLOR: Record<string, string> = {
  SUBMITTED: "bg-amber-100 text-amber-800",
  UNDER_REVIEW: "bg-blue-100 text-blue-800",
  RECOMMENDED_FOR_APPROVAL: "bg-emerald-100 text-emerald-800",
  RECOMMENDED_FOR_REJECTION: "bg-rose-100 text-rose-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
}

export default function ClaimDetail() {
  const { toast } = useToast()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { id: claimId } = useParams()
  const cid = Number(claimId)

  const { data: claim, isLoading: claimLoading } = useQuery({
    queryKey: ["claim-detail", cid],
    queryFn: async () => {
      const res = await getClaimById(cid)
      return res.data.data
    },
    enabled: !!cid,
  })

  const { data: documents, isLoading: docsLoading } = useQuery({
    queryKey: ["claim-documents", cid],
    queryFn: async () => {
      const res = await getClaimDocuments(cid)
      return res.data.data
    },
    enabled: !!cid,
  })

  const { data: history, isLoading: historyLoading } = useQuery({
    queryKey: ["claim-history", cid],
    queryFn: async () => {
      const res = await getClaimHistory(cid, { page: 1, size: 50 })
      return res.data.data.records
    },
    enabled: !!cid,
  })

  if (claimLoading || docsLoading || historyLoading) {
    return <div className="flex h-[600px] items-center justify-center"><div className="h-8 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" /></div>
  }

  if (!claim) {
    return <div className="flex h-[600px] items-center justify-center"><p className="text-gray-500">Claim not found.</p></div>
  }

  const canEdit = user?.role === "ADMIN" || user?.role === "AGENT"

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link to={user?.role === "ADMIN" ? "/admin/claims" : user?.role === "AGENT" ? "/agent/claims" : "/customer/claims"} className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400">
            <ArrowLeft size={16} /> Back to Claims
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-2">Claim #{claim.claimNumber}</h1>
        </div>
        <Badge className={STATUS_COLOR[claim.claimStatus] || "bg-gray-100"}>
          {claim.claimStatus.replace(/_/g, " ")}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Claim Details</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-3">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Claim Number</div>
                  <div className="text-sm font-mono font-medium">{claim.claimNumber}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Policy Number</div>
                  <div className="text-sm font-medium">{claim.policyNumber}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Customer</div>
                  <div className="text-sm font-medium">{claim.customerName}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Claim Amount</div>
                  <div className="text-sm font-medium">₹{claim.claimAmount?.toLocaleString()}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Incident Date</div>
                  <div className="text-sm font-medium">{claim.incidentDate}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-3">
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Submitted</div>
                  <div className="text-sm font-medium">{claim.createdDate}</div>
                </CardContent>
              </Card>
            </div>

            {claim.claimReason && (
              <div className="space-y-2">
                <div className="text-xs text-gray-500 uppercase tracking-wider">Reason</div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{claim.claimReason}</p>
              </div>
            )}

            {claim.agentRemarks && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-blue-600" />
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Agent Remarks</div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{claim.agentRemarks}</p>
              </div>
            )}

            {claim.adminRemarks && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User size={16} className="text-indigo-600" />
                  <div className="text-xs text-gray-500 uppercase tracking-wider">Admin Remarks</div>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300">{claim.adminRemarks}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Supporting Documents</CardTitle></CardHeader>
          <CardContent>
            {(documents || []).length > 0 ? (
              <div className="space-y-3">
                {(documents as any[]).map((doc: any) => (
                  <Card key={doc.id}>
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2">
                        <FileText size={18} className="text-gray-500" />
                        <div>
                          <div className="text-sm font-medium">{doc.documentName}</div>
                          {doc.documentType && (
                            <div className="text-xs text-gray-500">{doc.documentType}</div>
                          )}
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                        {doc.documentReference}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{doc.uploadedDate}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                No supporting documents submitted.
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Claim Status History</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Previous Status</TableHead>
                  <TableHead>New Status</TableHead>
                  <TableHead>Remarks</TableHead>
                  <TableHead>Updated By</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(history || []).map((h: any) => (
                  <TableRow key={h.id}>
                    <TableCell className="text-sm">{h.previousStatus || "-"}</TableCell>
                    <TableCell className="text-sm font-medium"><Badge className={STATUS_COLOR[h.newStatus] || "bg-gray-100"}>{h.newStatus.replace(/_/g, " ")}</Badge></TableCell>
                    <TableCell className="text-sm">{h.remarks || "-"}</TableCell>
                    <TableCell className="text-sm">{h.updatedBy || "-"}</TableCell>
                    <TableCell className="text-sm">{h.updatedDate}</TableCell>
                  </TableRow>
                ))}
                {(history || []).length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">No status history available.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

import { ArrowLeft } from "lucide-react"
