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
import { getMyPayments, getMyPolicies, recordPayment } from "@/services/api"
import { CreditCard, RefreshCw } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"

const STATUS_COLOR: Record<string, string> = {
  SUCCESS: "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300",
  FAILED: "bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300",
  PENDING: "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300",
}

export default function CustomerPayments() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ policyId: "", amount: "", paymentMode: "UPI" as const, transactionReference: "", paymentStatus: "SUCCESS" as const })

  const { data } = useQuery({
    queryKey: ["my-policies-for-pay"],
    queryFn: async () => {
      const res = await getMyPolicies({ page: 1, size: 50 })
      return res.data.data.records
    },
  })

  const { data: payments, isLoading } = useQuery({
    queryKey: ["my-payments"],
    queryFn: async () => {
      const res = await getMyPayments({ page: 1, size: 50 })
      return res.data.data.records
    },
  })

  const payMut = useMutation({
    mutationFn: recordPayment,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["my-payments"] }); setOpen(false); toast({ title: "Recorded", description: "Simulated payment recorded." }) },
    onError: (e: any) => toast({ variant: "destructive", title: "Error", description: e.response?.data?.message }),
  })

  if (isLoading) return <div className="flex h-[400px] items-center justify-center"><div className="h-8 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Payments</h1>
          <p className="text-gray-600 dark:text-gray-300">Record and view simulated premium payments.</p>
        </div>
        <Button variant="outline" onClick={() => { setForm({ policyId: "", amount: "", paymentMode: "UPI", transactionReference: `TXN-${Date.now()}`, paymentStatus: "SUCCESS" }); setOpen(true) }}>
          <RefreshCw size={18} /> Record Payment
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Payment History</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy #</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Mode</TableHead>
                  <TableHead>Ref</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(payments || []).map((p: any) => (
                  <TableRow key={p.id}>
                    <TableCell className="font-mono text-sm">{p.policyNumber}</TableCell>
                    <TableCell>₹{p.amount?.toLocaleString()}</TableCell>
                    <TableCell className="text-sm">{p.paymentDate}</TableCell>
                    <TableCell>{p.paymentMode}</TableCell>
                    <TableCell className="text-xs">{p.transactionReference}</TableCell>
                    <TableCell><Badge className={STATUS_COLOR[p.paymentStatus] || "bg-gray-100 dark:bg-gray-800"}>{p.paymentStatus}</Badge></TableCell>
                  </TableRow>
                ))}
                {(payments || []).length === 0 && (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-gray-500 dark:text-gray-400">No payments found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Simulated Payment</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">Payments are simulated — no real gateway is used.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            payMut.mutate({
              policyId: Number(form.policyId),
              amount: Number(form.amount),
              paymentMode: form.paymentMode,
              transactionReference: form.transactionReference,
              paymentStatus: form.paymentStatus,
            })
          }} className="space-y-4">
            <div className="space-y-2">
              <Label>Policy</Label>
              <Select value={form.policyId} onValueChange={(v) => {
                const selected = (data || []).find((p: any) => String(p.id) === v)
                setForm({
                  ...form,
                  policyId: v,
                  amount: selected ? String(selected.premiumAmount ?? "") : form.amount,
                  transactionReference: form.transactionReference || `TXN-${Date.now()}`,
                })
              }}>
                <SelectTrigger><SelectValue placeholder="Select policy" /></SelectTrigger>
                <SelectContent>
                  {(data || []).map((p: any) => <SelectItem key={p.id} value={String(p.id)}>{p.policyNumber} - {p.planName}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Mode</Label>
                <Select value={form.paymentMode} onValueChange={(v) => setForm({ ...form, paymentMode: v as any })}>
                  <SelectTrigger><SelectValue placeholder="Mode" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UPI">UPI</SelectItem>
                    <SelectItem value="CARD">Card</SelectItem>
                    <SelectItem value="NET_BANKING">Net Banking</SelectItem>
                    <SelectItem value="CASH">Cash</SelectItem>
                  </SelectContent>
                </Select>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={form.paymentStatus} onValueChange={(v) => setForm({ ...form, paymentStatus: v as any })}>
                    <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SUCCESS">Success</SelectItem>
                      <SelectItem value="FAILED">Failed</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Transaction Reference</Label>
                <Input value={form.transactionReference} onChange={(e) => setForm({ ...form, transactionReference: e.target.value })} required />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={payMut.isPending}>Record Payment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
