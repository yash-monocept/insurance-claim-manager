"use client"

import React, { useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { issuePolicy, getCustomers, getPlans } from "@/services/api"
import { FilePlus, User, Shield } from "lucide-react"

export default function AgentIssuePolicy() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ customerId: "", planId: "", startDate: "" })

  const { data: customers } = useQuery({
    queryKey: ["agent-issue-customers"],
    queryFn: async () => { const r = await getCustomers({ page: 1, size: 100 }); return r.data.data.records },
  })
  const { data: plans } = useQuery({
    queryKey: ["agent-issue-plans"],
    queryFn: async () => { const r = await getPlans({ page: 1, size: 100 }); return r.data.data.records.filter((p: any) => p.active) },
  })

  const issueMut = useMutation({
    mutationFn: issuePolicy,
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["policies"] }); toast({ title: "Issued", description: "Policy issued successfully." }) },
    onError: (e: any) => toast({ variant: "destructive", title: "Error", description: e.response?.data?.message }),
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Issue Policy</h1>
        <p className="text-gray-600 dark:text-gray-300">Issue a new insurance policy to a customer.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Issue New Policy</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={(e) => {
            e.preventDefault()
            issueMut.mutate({ customerId: Number(form.customerId), planId: Number(form.planId), startDate: form.startDate })
          }} className="space-y-4">
            <div className="space-y-2">
              <Label>Customer</Label>
              <Select value={form.customerId} onValueChange={(v) => setForm({ ...form, customerId: v })}>
                <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
                <SelectContent>
                  {(customers || []).map((c: any) => <SelectItem key={c.id} value={String(c.id)}>{c.fullName} ({c.email})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Plan</Label>
              <Select value={form.planId} onValueChange={(v) => setForm({ ...form, planId: v })}>
                <SelectTrigger><SelectValue placeholder="Select active plan" /></SelectTrigger>
                <SelectContent>
                  {(plans || []).map((p: any) => <SelectItem key={p.id} value={String(p.id)}>{p.planName} - ₹{p.premiumAmount}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
            </div>
            <div className="pt-4">
              <Button type="submit" disabled={issueMut.isPending}>Issue Policy</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
