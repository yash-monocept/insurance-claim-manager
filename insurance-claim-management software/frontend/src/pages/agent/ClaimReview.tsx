"use client"

import React, { useEffect, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getAllClaims, reviewClaim, recommendClaim } from "@/services/api"
import { Clock, ShieldCheck, FileText } from "lucide-react"

function statusColor(s: string) {
  switch (s) {
    case "SUBMITTED": return "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800"
    case "UNDER_REVIEW": return "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800"
    case "RECOMMENDED_FOR_APPROVAL": return "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
    case "RECOMMENDED_FOR_REJECTION": return "bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800"
    default: return "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 border-gray-200 dark:border-gray-700"
  }
}

export default function AgentClaimReview() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [reviewing, setReviewing] = useState<number | null>(null)
  const [reviewForm, setReviewForm] = useState({ remarks: "" })

  const { data, isLoading } = useQuery({
    queryKey: ["claims-review"],
    queryFn: async () => {
      const res = await getAllClaims({ page: 1, size: 50 })
      return res.data.data.records
    },
  })

  const reviewMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => reviewClaim(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["claims-review"] }); setReviewing(null); toast({ title: "Saved", description: "Claim moved to review." }) },
    onError: (e: any) => toast({ variant: "destructive", title: "Error", description: e.response?.data?.message }),
  })
  const recommendMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => recommendClaim(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["claims-review"] }); setReviewing(null); toast({ title: "Saved", description: "Recommendation recorded." }) },
    onError: (e: any) => toast({ variant: "destructive", title: "Error", description: e.response?.data?.message }),
  })

  if (isLoading) return <div className="flex h-[400px] items-center justify-center"><div className="h-8 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" /></div>

  const pending = (data || []).filter((c: any) => c.claimStatus === "SUBMITTED")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Claim Review Queue</h1>
          <p className="text-gray-600 dark:text-gray-300">Review and act on submitted claims.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Pending Review</p>
              <p className="text-2xl font-bold">{pending.length}</p>
            </div>
            <div className="p-3 rounded-md bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400"><Clock size={28} /></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Claims Awaiting Review</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim #</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Policy</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Incident Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pending.map((c: any) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-sm">{c.claimNumber}</TableCell>
                    <TableCell>{c.customerName}</TableCell>
                    <TableCell>{c.policyNumber}</TableCell>
                    <TableCell>₹{c.claimAmount?.toLocaleString()}</TableCell>
                    <TableCell className="text-sm">{c.incidentDate}</TableCell>
                    <TableCell><Badge variant="outline" className={statusColor(c.claimStatus)}>{c.claimStatus.replace(/_/g, " ")}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" onClick={() => { setReviewing(c.id); setReviewForm({ remarks: "" }) }}>
                        Start Review
                      </Button>
                      {reviewing === c.id && (
                        <Dialog open={reviewing === c.id} onOpenChange={(o) => { if (!o) setReviewing(null) }}>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Review Claim #{c.claimNumber}</DialogTitle>
                              <DialogDescription>Move this claim to Under Review.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={(e) => {
                              e.preventDefault()
                              reviewMut.mutate({ id: c.id, data: { recommendedStatus: "UNDER_REVIEW", remarks: reviewForm.remarks } })
                            }} className="space-y-3">
                              <div className="space-y-2">
                                <Label>Review Remarks</Label>
                                <Input value={reviewForm.remarks} onChange={(e) => setReviewForm({ ...reviewForm, remarks: e.target.value })} required />
                              </div>
                              <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setReviewing(null)}>Cancel</Button>
                                <Button type="submit" disabled={reviewMut.isPending}>Start Review</Button>
                              </DialogFooter>
                            </form>
                          </DialogContent>
                        </Dialog>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {pending.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500 dark:text-gray-400">No claims pending review.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(data || []).filter((c: any) => c.claimStatus === "UNDER_REVIEW").map((c: any) => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck size={20} />
                Recommend: #{c.claimNumber}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <div><strong>Customer:</strong> {c.customerName}</div>
                <div><strong>Policy:</strong> {c.policyNumber}</div>
                <div><strong>Amount:</strong> ₹{c.claimAmount?.toLocaleString()}</div>
              </div>
              <div className="flex flex-col gap-2 w-full">
                <Button size="sm" className="w-full" onClick={() => recommendMut.mutate({ id: c.id, data: { recommendedStatus: "RECOMMENDED_FOR_APPROVAL", remarks: "Recommended for approval by agent" } })}>
                  Recommend Approval
                </Button>
                <Button size="sm" variant="outline" className="w-full" onClick={() => recommendMut.mutate({ id: c.id, data: { recommendedStatus: "RECOMMENDED_FOR_REJECTION", remarks: "Recommended for rejection by agent" } })}>
                  Recommend Rejection
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
