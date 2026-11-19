"use client"

import React, { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { getAllPayments, getAllPolicies, recordPayment } from "@/services/api"
import { Plus, Search } from "lucide-react"

const STATUS_COLOR: Record<string, string> = {
  SUCCESS: "bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300",
  FAILED: "bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300",
  PENDING: "bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-300",
}

const emptyForm = () => ({
  policyId: "",
  amount: "",
  paymentMode: "UPI",
  transactionReference: `TXN-${Date.now()}`,
  paymentStatus: "SUCCESS",
})

export default function AgentPayments() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm())

  const { data, isLoading } = useQuery({
    queryKey: ["agent-payments"],
    queryFn: async () => { const r = await getAllPayments({ page: 1, size: 100 }); return r.data.data.records },
  })

  const term = search.trim().toLowerCase()
  const rows = (data || []).filter((p: any) =>
    !term || [p.policyNumber, p.transactionReference, p.paymentMode, p.paymentStatus].join(" ").toLowerCase().includes(term)
  )

  const { data: policies } = useQuery({
    queryKey: ["payable-policies"],
    queryFn: async () => {
      const r = await getAllPolicies({ page: 1, size: 100, sortField: "createdDate", sortDir: "desc" })
      return (r.data.data.records || []).filter(
        (p: any) => p.policyStatus === "PENDING_PAYMENT" || p.policyStatus === "ACTIVE"
      )
    },
  })

  const payMut = useMutation({
    mutationFn: () =>
      recordPayment({
        policyId: Number(form.policyId),
        amount: Number(form.amount),
        paymentMode: form.paymentMode as any,
        transactionReference: form.transactionReference,
        paymentStatus: form.paymentStatus as any,
      }),
    onSuccess: () => {
      setOpen(false)
      setForm(emptyForm())
      queryClient.invalidateQueries({ queryKey: ["agent-payments"] })
      queryClient.invalidateQueries({ queryKey: ["payable-policies"] })
      queryClient.invalidateQueries({ queryKey: ["all-policies"] })
      toast({ title: "Payment recorded", description: "Successful required payments activate the policy." })
    },
    onError: (e: any) =>
      toast({
        variant: "destructive",
        title: "Payment failed",
        description: e.response?.data?.message || "Please check the details and try again.",
      }),
  })

  function openDialog() {
    setForm(emptyForm())
    setOpen(true)
  }

  function selectPolicy(value: string) {
    const policy = (policies || []).find((p: any) => String(p.id) === value)
    setForm({
      ...form,
      policyId: value,
      amount: policy ? String(policy.premiumAmount ?? "") : form.amount,
    })
  }

  if (isLoading) return <div className="flex h-[400px] items-center justify-center"><div className="h-8 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Payments</h1>
          <p className="text-gray-600 dark:text-gray-300">View and record simulated premium payments.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-400" />
            <Input placeholder="Search payments..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
          </div>
          <Button onClick={openDialog}><Plus size={16} /> Record Payment</Button>
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Payments</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Policy #</TableHead>
                  <TableHead>Amount</TableHead>
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
                    <TableCell>{p.paymentMode}</TableCell>
                    <TableCell className="text-xs">{p.transactionReference}</TableCell>
                    <TableCell><Badge className={STATUS_COLOR[p.paymentStatus] || "bg-gray-100 dark:bg-gray-800"}>{p.paymentStatus}</Badge></TableCell>
                  </TableRow>
                ))}
                {(rows || []).length === 0 && (
                  <TableRow><TableCell colSpan={5} className="text-center py-8 text-gray-500 dark:text-gray-400">No payments found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Payment</DialogTitle>
            <DialogDescription>
              Record a simulated premium payment on behalf of a customer.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => { e.preventDefault(); payMut.mutate() }}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label>Policy</Label>
              <Select value={form.policyId} onValueChange={selectPolicy}>
                <SelectTrigger><SelectValue placeholder="Select a policy" /></SelectTrigger>
                <SelectContent>
                  {(policies || []).map((p: any) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.policyNumber} · {p.customerName} · ₹{p.premiumAmount?.toLocaleString()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {(!policies || policies.length === 0) && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  No policies are currently awaiting or holding premium payments.
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Amount (₹)</Label>
              <Input
                type="number"
                min="0.01"
                step="0.01"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Payment Mode</Label>
                <Select value={form.paymentMode} onValueChange={(v) => setForm({ ...form, paymentMode: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["UPI", "CARD", "NET_BANKING", "CASH"].map((m) => (
                      <SelectItem key={m} value={m}>{m.replace(/_/g, " ")}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={form.paymentStatus} onValueChange={(v) => setForm({ ...form, paymentStatus: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["SUCCESS", "PENDING", "FAILED"].map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Transaction Reference</Label>
              <Input
                value={form.transactionReference}
                onChange={(e) => setForm({ ...form, transactionReference: e.target.value })}
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={payMut.isPending || !form.policyId}>Save Payment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
