"use client"

import React, { useEffect, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getProducts, createProduct, updateProduct, toggleProductStatus, type ProductRequest } from "@/services/api"
import { Plus, Edit2, Trash2, RefreshCw } from "lucide-react"

type ProductStatus = "ACTIVE" | "INACTIVE"

type ProductForm = {
  productName: string
  productType: ProductRequest["productType"]
  description: string
  active: boolean
}

const emptyForm: ProductForm = { productName: "", productType: "HEALTH", description: "", active: true }

function statusBadge(status: boolean) {
  return (
    <Badge variant={status ? "default" : "secondary"}>
      {status ? "Active" : "Inactive"}
    </Badge>
  )
}

export default function AdminProducts() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<number | null>(null)
  const [form, setForm] = useState<ProductForm>(emptyForm)

  const { data, isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await getProducts({ page: 1, size: 50 })
      return res.data.data.records
    },
  })

  const createMut = useMutation({
    mutationFn: createProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      setOpen(false)
      toast({ title: "Saved", description: "Product created." })
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Error", description: e.response?.data?.message }),
  })

  const updateMut = useMutation({
    mutationFn: ({ id, data }: { id: number; data: any }) => updateProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] })
      setEditing(null)
      toast({ title: "Saved", description: "Product updated." })
    },
    onError: (e: any) => toast({ variant: "destructive", title: "Error", description: e.response?.data?.message }),
  })

  const toggleMut = useMutation({
    mutationFn: ({ id, active }: { id: number; active: boolean }) => toggleProductStatus(id, active),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["products"] }),
    onError: (e: any) => toast({ variant: "destructive", title: "Error", description: e.response?.data?.message }),
  })

  if (isLoading) return <div className="flex h-[300px] items-center justify-center"><div className="h-8 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Insurance Products</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage insurance products offered by the organisation.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={() => queryClient.invalidateQueries({ queryKey: ["products"] })}>Refresh</Button>
          <Button variant="outline" onClick={() => { setEditing(null); setForm(emptyForm); setOpen(true) }}>
            <Plus size={18} /> Add Product
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data || []).map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>{p.productName}</TableCell>
                    <TableCell>{p.productType}</TableCell>
                    <TableCell className="text-gray-600 dark:text-gray-300 text-sm">{p.description ?? "-"}</TableCell>
                    <TableCell>{statusBadge(p.active)}</TableCell>
                    <TableCell className="text-right flex flex-wrap gap-2 sm:flex-nowrap">
                      <Button size="sm" variant="outline" onClick={() => { setEditing(p.id); setForm({ productName: p.productName, productType: p.productType as ProductForm["productType"], description: p.description ?? "", active: p.active }); setOpen(true) }}>
                        <Edit2 size={16} />
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => toggleMut.mutate({ id: p.id, active: !p.active })}>
                        {p.active ? <Trash2 size={16} /> : <RefreshCw size={16} />}
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
        <DialogTrigger asChild>
          <Button variant="outline">Edit</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Product" : "New Product"}</DialogTitle>
            <DialogDescription>Manage product details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={(e) => {
            e.preventDefault()
            if (editing) updateMut.mutate({ id: editing, data: form })
            else createMut.mutate(form)
          }} className="space-y-4">
            <div className="space-y-2">
              <Label>Product Name</Label>
              <Input value={form.productName} onChange={(e) => setForm({ ...form, productName: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Product Type</Label>
              <Select value={form.productType} onValueChange={(v) => setForm({ ...form, productType: v as any })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="HEALTH">Health Insurance</SelectItem>
                  <SelectItem value="MOTOR">Motor Insurance</SelectItem>
                  <SelectItem value="LIFE">Life Insurance</SelectItem>
                  <SelectItem value="TRAVEL">Travel Insurance</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <Label>Active</Label>
              <Select value={String(form.active)} onValueChange={(v) => setForm({ ...form, active: v === "true" })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Active</SelectItem>
                  <SelectItem value="false">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Separator />
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={createMut.isPending || updateMut.isPending}>
                {editing ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
