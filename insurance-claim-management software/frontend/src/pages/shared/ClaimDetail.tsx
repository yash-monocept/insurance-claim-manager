"use client"

import React, { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/context/AuthContext"
import {
  decideClaim,
  getClaimById,
  getClaimHistory,
  recommendClaim,
  reviewClaim,
} from "@/services/api"
import { ArrowLeft } from "lucide-react"

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</div>
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{value ?? "-"}</div>
    </div>
  )
}

type ClaimAction =
  | { kind: "review" }
  | { kind: "recommend"; status: "RECOMMENDED_FOR_APPROVAL" | "RECOMMENDED_FOR_REJECTION" }
  | { kind: "decide"; status: "APPROVED" | "REJECTED" }

export default function ClaimDetail({ backTo = "/admin/claims" }: { backTo?: string }) {
  const { id } = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [remarks, setRemarks] = useState("")

  const { data: claim, isLoading, isError } = useQuery({
    queryKey: ["claim", id],
    queryFn: async () => {
      const res = await getClaimById(Number(id))
      return res.data.data
    },
    enabled: !!id,
  })

  const { data: history } = useQuery({
    queryKey: ["claim-history", id],
    queryFn: async () => {
      const res = await getClaimHistory(Number(id), { page: 1, size: 50 })
      return res.data.data.records
    },
    enabled: !!id,
  })

  const actionMut = useMutation({
    mutationFn: async (action: ClaimAction) => {
      const claimId = Number(id)
      if (action.kind === "review") {
        return reviewClaim(claimId, { recommendedStatus: "UNDER_REVIEW", remarks })
      }
      if (action.kind === "recommend") {
        return recommendClaim(claimId, { recommendedStatus: action.status, remarks })
      }
      return decideClaim(claimId, { finalStatus: action.status, remarks })
    },
    onSuccess: () => {
      setRemarks("")
      queryClient.invalidateQueries({ queryKey: ["claim", id] })
      queryClient.invalidateQueries({ queryKey: ["claim-history", id] })
      queryClient.invalidateQueries({ queryKey: ["claims-review"] })
      queryClient.invalidateQueries({ queryKey: ["all-claims"] })
      toast({ title: "Claim updated", description: "The status change was recorded in history." })
    },
    onError: (e: any) =>
      toast({
        variant: "destructive",
        title: "Action failed",
        description: e.response?.data?.message || "Please try again.",
      }),
  })

  const status = claim?.claimStatus as string | undefined
  const isAgent = user?.role === "AGENT"
  const isAdmin = user?.role === "ADMIN"
  const canReview = isAgent && status === "SUBMITTED"
  const canRecommend = isAgent && status === "UNDER_REVIEW"
  const canDecide =
    isAdmin && (status === "RECOMMENDED_FOR_APPROVAL" || status === "RECOMMENDED_FOR_REJECTION")
  const canAct = canReview || canRecommend || canDecide
  const remarksRequired = !remarks.trim()

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-3 -ml-2">
          <Link to={backTo}><ArrowLeft size={16} /> Back to claims</Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Claim Details</h1>
        <p className="text-gray-600 dark:text-gray-300">Claim information and status history.</p>
      </div>

      {isLoading && (
        <div className="flex h-[300px] items-center justify-center">
          <div className="h-8 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
      )}

      {(isError || (!isLoading && !claim)) && (
        <Card>
          <CardContent className="py-10 text-center text-gray-500 dark:text-gray-400">Claim not found.</CardContent>
        </Card>
      )}

      {claim && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="font-mono">{claim.claimNumber}</CardTitle>
                <Badge>{claim.claimStatus.replace(/_/g, " ")}</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Policy" value={claim.policyNumber} />
              <Field label="Customer" value={claim.customerName} />
              <Field label="Claim Amount" value={`₹${claim.claimAmount?.toLocaleString()}`} />
              <Field label="Incident Date" value={claim.incidentDate} />
              <Field label="Reason" value={claim.claimReason} />
              <Field label="Agent Remarks" value={claim.agentRemarks} />
              <Field label="Admin Remarks" value={claim.adminRemarks} />
              <Field label="Submitted" value={claim.createdDate} />
            </CardContent>
          </Card>

          {canAct && (
            <Card>
              <CardHeader>
                <CardTitle>
                  {canReview && "Start Review"}
                  {canRecommend && "Recommend a Decision"}
                  {canDecide && "Final Decision"}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="claim-remarks">Remarks</Label>
                  <Input
                    id="claim-remarks"
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    placeholder="Explain the reason for this status change"
                    maxLength={1000}
                  />
                  {remarksRequired && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Remarks are required before recording a status change.
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {canReview && (
                    <Button
                      onClick={() => actionMut.mutate({ kind: "review" })}
                      disabled={actionMut.isPending || remarksRequired}
                    >
                      Start Review
                    </Button>
                  )}
                  {canRecommend && (
                    <>
                      <Button
                        onClick={() => actionMut.mutate({ kind: "recommend", status: "RECOMMENDED_FOR_APPROVAL" })}
                        disabled={actionMut.isPending || remarksRequired}
                      >
                        Recommend Approval
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => actionMut.mutate({ kind: "recommend", status: "RECOMMENDED_FOR_REJECTION" })}
                        disabled={actionMut.isPending || remarksRequired}
                      >
                        Recommend Rejection
                      </Button>
                    </>
                  )}
                  {canDecide && (
                    <>
                      <Button
                        onClick={() => actionMut.mutate({ kind: "decide", status: "APPROVED" })}
                        disabled={actionMut.isPending || remarksRequired}
                      >
                        Approve Claim
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => actionMut.mutate({ kind: "decide", status: "REJECTED" })}
                        disabled={actionMut.isPending || remarksRequired}
                      >
                        Reject Claim
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader><CardTitle>Status History</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              {(history || []).map((h) => (
                <div key={h.id} className="border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                  <div className="text-sm font-medium">{h.previousStatus ? `${h.previousStatus} → ` : ""}{h.newStatus}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{h.remarks || "No remarks"} · {h.updatedBy} · {h.updatedDate}</div>
                </div>
              ))}
              {(history || []).length === 0 && (
                <p className="text-sm text-gray-500 dark:text-gray-400">No status changes recorded yet.</p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
