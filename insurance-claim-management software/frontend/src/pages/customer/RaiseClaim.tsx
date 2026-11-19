"use client"

import React, { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getMyPolicies, submitClaim, getMyClaims } from "@/services/api"
import { FilePlus, ClipboardList, FileText } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

function localToday() {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

const STATUS_COLOR: Record<string, string> = {
  SUBMITTED: "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300",
  UNDER_REVIEW: "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300",
  RECOMMENDED_FOR_APPROVAL: "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300",
  RECOMMENDED_FOR_REJECTION: "bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300",
  APPROVED: "bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300",
  REJECTED: "bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300",
}

export default function CustomerRaiseClaim() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ policyId: "", claimAmount: "", claimReason: "", incidentDate: "", documentReference: "", documentName: "", documentType: "" })

  const { data } = useQuery({
    queryKey: ["my-policies-for-claim"],
    queryFn: async () => {
      const res = await getMyPolicies({ page: 1, size: 50 })
      return res.data.data.records.filter((p: any) => p.policyStatus === "ACTIVE")
    },
  })

  const { data: claims } = useQuery({
    queryKey: ["my-claims"],
    queryFn: async () => {
      const res = await getMyClaims({ page: 1, size: 50 })
      return res.data.data.records
    },
  })

  const submitMut = useMutation({
    mutationFn: submitClaim,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["my-claims"] }); setOpen(false); toast({ title: "Claim Submitted", description: "Your claim has been submitted." }) },
    onError: (e: any) => toast({ variant: "destructive", title: "Error", description: e.response?.data?.message }),
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Raise a Claim</h1>
          <p className="text-gray-600 dark:text-gray-300">Submit a claim against an active policy.</p>
        </div>
        <Button variant="outline" onClick={() => { setForm({ policyId: "", claimAmount: "", claimReason: "", incidentDate: localToday(), documentReference: `DOC-${Date.now()}`, documentName: "Hospital Invoice", documentType: "" }); setOpen(true) }}>
          <FilePlus size={18} /> New Claim
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>My Claims</CardTitle></CardHeader>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Claim #</TableHead>
                  <TableHead>Policy</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Incident Date</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(claims || []).map((c: any) => (
                  <TableRow key={c.id}>
                    <TableCell className="font-mono text-sm">{c.claimNumber}</TableCell>
                    <TableCell>{c.policyNumber}</TableCell>
                    <TableCell>₹{c.claimAmount?.toLocaleString()}</TableCell>
                    <TableCell className="text-sm">{c.incidentDate}</TableCell>
                    <TableCell>
                      <Badge className={STATUS_COLOR[c.claimStatus] || "bg-gray-100 dark:bg-gray-800"}>
                        {c.claimStatus.replace(/_/g, " ")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {(claims || []).length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">No claims submitted yet.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Claim</DialogTitle>
            <DialogDescription>File a claim against an active policy.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            submitMut.mutate({
              policyId: Number(form.policyId),
              claimAmount: Number(form.claimAmount),
              claimReason: form.claimReason,
              incidentDate: form.incidentDate,
              documentReference: form.documentReference,
              documentName: form.documentName,
              documentType: form.documentType,
            })
          }} className="space-y-4">
            <div className="space-y-2">
              <Label>Policy</Label>
              <Select value={form.policyId} onValueChange={(v) => {
                const selected = (data || []).find((p: any) => String(p.id) === v)
                setForm({ ...form, policyId: v, claimAmount: selected ? String(selected.coverageAmount ?? "") : form.claimAmount })
              }}>
                <SelectTrigger><SelectValue placeholder="Select active policy" /></SelectTrigger>
                <SelectContent>
                  {(data || []).map((p: any) => <SelectItem key={p.id} value={String(p.id)}>{p.policyNumber} - {p.planName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Claim Amount (₹)</Label>
              <Input type="number" value={form.claimAmount} onChange={(e) => setForm({ ...form, claimAmount: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Reason</Label>
              <Input value={form.claimReason} onChange={(e) => setForm({ ...form, claimReason: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Incident Date</Label>
              <Input type="date" max={localToday()} value={form.incidentDate} onChange={(e) => setForm({ ...form, incidentDate: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Document Reference</Label>
              <Input value={form.documentReference} onChange={(e) => setForm({ ...form, documentReference: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Document Name</Label>
                <Input value={form.documentName} onChange={(e) => setForm({ ...form, documentName: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Document Type</Label>
                <Input value={form.documentType} onChange={(e) => setForm({ ...form, documentType: e.target.value })} />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Document upload is simulated — a reference is sufficient.</p>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={submitMut.isPending}>Submit Claim</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function TableContainer({ children }: { children: React.ReactNode }) {
  return <div className="overflow-x-auto">{children}</div>
}
