"use client"

import React, { useEffect, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getPlans, getPublicProducts, createPlan, updatePlan, togglePlanStatus, type PlanRequest } from "@/services/api"
import { Plus, Edit2, RefreshCw } from "lucide-react"

type PlanForm = {
  planName: string
  coverageAmount: string
  premiumAmount: string
  premiumType: "ONE_TIME" | "ANNUAL"
  durationYears: string
  termsAndConditions: string
  active: boolean
  productId: string
}

const emptyForm: PlanForm = {
  planName: "",
  coverageAmount: "",
  premiumAmount: "",
  premiumType: "ONE_TIME",
  durationYears: "",
  termsAndConditions: "",
  active: true,
  productId: "",
}

export default function AdminPlans() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<number | null>(null)
  const [form, setForm] = useState<PlanForm>(emptyForm)

  const { data: products, isLoading: ploading } = useQuery({
    queryKey: ["public-products"],
    queryFn: async () => {
      const res = await getPublicProducts({ page: 1, size: 100 })
      return res.data.data.records
    },
  })

  const { data, isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: async () => {
      const res = await getPlans({ page: 1, size: 100 })
      return res.data.data.records
    },
  })

  const createMut = useMutation({
    mutationFn: (data: PlanRequest) => createPlan(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["plans"] }); setOpen(false); toast({ title: "Saved", description: "Plan created." }) },
    onError: (e: any) => toast({ variant: "destructive", title: "Error", description: e.response?.data?.message }),
  })
  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updatePlan(id, data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["plans"] }); setEditing(null); toast({ title: "Saved", description: "Plan updated." }) },
    onError: (e: any) => toast({ variant: "destructive", title: "Error", description: e.response?.data?.message }),
  })
  const toggleMut = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) => togglePlanStatus(id, active),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["plans"] }),
    onError: (e: any) => toast({ variant: "destructive", title: "Error", description: e.response?.data?.message }),
  })

  if (isLoading) return <div className="flex h-[300px] items-center justify-center"><div className="h-8 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Policy Plans</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage purchasable plans under insurance products.</p>
        </div>
        <Button variant="outline" onClick={() => { setEditing(null); setForm(emptyForm); setOpen(true) }}>
          <Plus size={18} /> Add Plan
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Plans</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Plan</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Coverage</TableHead>
                  <TableHead>Premium</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data || []).map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.planName}</TableCell>
                    <TableCell>{p.productName}</TableCell>
                    <TableCell>₹{p.coverageAmount?.toLocaleString()}</TableCell>
                    <TableCell>₹{p.premiumAmount?.toLocaleString()}</TableCell>
                    <TableCell>{p.durationYears} yr</TableCell>
                    <TableCell>{statusBadge(p.active)}</TableCell>
                    <TableCell className="text-right flex flex-wrap gap-2 sm:flex-nowrap">
                      <Button size="sm" variant="outline" onClick={() => { setEditing(p.id); setForm({ planName: p.planName, coverageAmount: String(p.coverageAmount), premiumAmount: String(p.premiumAmount), premiumType: p.premiumType as "ONE_TIME" | "ANNUAL", durationYears: String(p.durationYears), termsAndConditions: p.termsAndConditions ?? "", active: p.active, productId: String(p.productId) }); setOpen(true) }}>
                        <Edit2 size={16} />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toggleMut.mutate({ id: p.id, active: !p.active })}>
                        {p.active ? "Deactivate" : "Activate"}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Plan" : "New Plan"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            const payload: PlanRequest = {
              productId: Number(form.productId),
              planName: form.planName,
              coverageAmount: Number(form.coverageAmount),
              premiumAmount: Number(form.premiumAmount),
              premiumType: form.premiumType,
              durationYears: Number(form.durationYears),
              termsAndConditions: form.termsAndConditions,
              active: form.active,
            }
            if (editing) updateMut.mutate({ id: editing, data: payload })
            else createMut.mutate(payload)
          }} className="space-y-4">
            <div className="space-y-2">
              <Label>Product</Label>
              <Select value={form.productId} onValueChange={(v) => setForm({ ...form, productId: v })}>
                <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                <SelectContent>
                  {(products || []).map((p: any) => (
                    <SelectItem key={p.id} value={String(p.id)}>{p.productName}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Plan Name</Label>
              <Input value={form.planName} onChange={(e) => setForm({ ...form, planName: e.target.value })} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Coverage Amount</Label>
                <Input type="number" value={form.coverageAmount} onChange={(e) => setForm({ ...form, coverageAmount: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Premium Amount</Label>
                <Input type="number" value={form.premiumAmount} onChange={(e) => setForm({ ...form, premiumAmount: e.target.value })} required />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Premium Type</Label>
                <Select value={form.premiumType} onValueChange={(v) => setForm({ ...form, premiumType: v as any })}>
                  <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ONE_TIME">One-time</SelectItem>
                    <SelectItem value="ANNUAL">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Duration (years)</Label>
                <Input type="number" value={form.durationYears} onChange={(e) => setForm({ ...form, durationYears: e.target.value })} required />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Terms & Conditions</Label>
              <Input value={form.termsAndConditions} onChange={(e) => setForm({ ...form, termsAndConditions: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Active</Label>
              <Select value={String(form.active)} onValueChange={(v) => setForm({ ...form, active: v === "true" })}>
                <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMut.isPending || updateMut.isPending}>{editing ? "Update" : "Create"}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function statusBadge(active: boolean) {
  return <Badge variant={active ? "default" : "secondary"}>{active ? "Active" : "Inactive"}</Badge>
}
