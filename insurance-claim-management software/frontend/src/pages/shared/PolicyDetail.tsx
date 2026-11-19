"use client"

import React, { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/components/ui/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useAuth } from "@/context/AuthContext"
import { cancelPolicy, getPolicyById } from "@/services/api"
import { ArrowLeft } from "lucide-react"

const STATUS_COLOR: Record<string, string> = {
  PENDING_PAYMENT: "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300",
  ACTIVE: "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300",
  EXPIRED: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100",
  CANCELLED: "bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300",
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</div>
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{value ?? "-"}</div>
    </div>
  )
}

export default function PolicyDetail({ backTo = "/admin/policies" }: { backTo?: string }) {
  const { id } = useParams()
  const { user } = useAuth()
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const { data: policy, isLoading, isError } = useQuery({
    queryKey: ["policy", id],
    queryFn: async () => {
      const res = await getPolicyById(Number(id))
      return res.data.data
    },
    enabled: !!id,
  })

  const cancelMut = useMutation({
    mutationFn: () => cancelPolicy(Number(id)),
    onSuccess: () => {
      setConfirmOpen(false)
      queryClient.invalidateQueries({ queryKey: ["policy", id] })
      queryClient.invalidateQueries({ queryKey: ["all-policies"] })
      queryClient.invalidateQueries({ queryKey: ["my-policies"] })
      toast({ title: "Policy cancelled", description: "The policy can no longer be reactivated." })
    },
    onError: (e: any) =>
      toast({
        variant: "destructive",
        title: "Could not cancel policy",
        description: e.response?.data?.message || "Please try again.",
      }),
  })

  const canCancel =
    (user?.role === "ADMIN" || user?.role === "AGENT") &&
    (policy?.policyStatus === "ACTIVE" || policy?.policyStatus === "PENDING_PAYMENT")

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-3 -ml-2">
          <Link to={backTo}><ArrowLeft size={16} /> Back to policies</Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Policy Details</h1>
        <p className="text-gray-600 dark:text-gray-300">Full information for this policy.</p>
      </div>

      {isLoading && (
        <div className="flex h-[300px] items-center justify-center">
          <div className="h-8 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
      )}

      {(isError || (!isLoading && !policy)) && (
        <Card>
          <CardContent className="py-10 text-center text-gray-500 dark:text-gray-400">Policy not found.</CardContent>
        </Card>
      )}

      {policy && (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="font-mono">{policy.policyNumber}</CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={STATUS_COLOR[policy.policyStatus] || "bg-gray-100 dark:bg-gray-800"}>
                    {policy.policyStatus.replace(/_/g, " ")}
                  </Badge>
                  {canCancel && (
                    <Button size="sm" variant="outline" onClick={() => setConfirmOpen(true)}>
                      Cancel Policy
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Customer" value={policy.customerName} />
              <Field label="Customer Email" value={policy.customerEmail} />
              <Field label="Plan" value={policy.planName} />
              <Field label="Product Type" value={policy.productType} />
              <Field label="Coverage Amount" value={`₹${policy.coverageAmount?.toLocaleString()}`} />
              <Field label="Premium Amount" value={`₹${policy.premiumAmount?.toLocaleString()} (${policy.premiumType})`} />
              <Field label="Total Premium Paid" value={`₹${policy.totalPremiumPaid?.toLocaleString()}`} />
              <Field label="Start Date" value={policy.startDate} />
              <Field label="End Date" value={policy.endDate} />
              <Field label="Created" value={policy.createdDate} />
            </CardContent>
          </Card>

          <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cancel {policy.policyNumber}?</DialogTitle>
                <DialogDescription>
                  Cancelling a policy prevents further payments and new claims. This action cannot be undone.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setConfirmOpen(false)}>Keep Policy</Button>
                <Button variant="destructive" onClick={() => cancelMut.mutate()} disabled={cancelMut.isPending}>
                  Cancel Policy
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  )
}
