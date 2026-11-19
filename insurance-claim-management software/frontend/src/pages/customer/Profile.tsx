"use client"

import React, { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { getMyProfile, updateCustomerProfile } from "@/services/api"
import { User, Edit2 } from "lucide-react"

export default function CustomerProfile() {
  const { toast } = useToast()
  const queryClient = useQueryClient()
  const [form, setForm] = useState({ dateOfBirth: "", address: "", city: "", state: "", pinCode: "", nomineeName: "", nomineeRelation: "" })
  const [editing, setEditing] = useState(false)

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["my-profile"],
    queryFn: async () => {
      const res = await getMyProfile()
      return res.data.data
    },
  })

  const updateMut = useMutation({
    mutationFn: updateCustomerProfile,
    onSuccess: () => { setEditing(false); queryClient.invalidateQueries({ queryKey: ["my-profile"] }); toast({ title: "Saved", description: "Profile updated." }) },
    onError: (e: any) => toast({ variant: "destructive", title: "Error", description: e.response?.data?.message }),
  })

  const toggleEditing = () => {
    if (!editing) {
      setForm({
        dateOfBirth: data?.dateOfBirth ?? "",
        address: data?.address ?? "",
        city: data?.city ?? "",
        state: data?.state ?? "",
        pinCode: data?.pinCode ?? "",
        nomineeName: data?.nomineeName ?? "",
        nomineeRelation: data?.nomineeRelation ?? "",
      })
    }
    setEditing(!editing)
  }

  if (isLoading) return <div className="flex h-[400px] items-center justify-center"><div className="h-8 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" /></div>

  if (isError) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your personal information.</p>
        </div>
        <Card>
          <CardContent className="py-10 text-center space-y-3">
            <p className="text-gray-600 dark:text-gray-300">We could not load your profile.</p>
            <Button variant="outline" onClick={() => refetch()}>Try again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">My Profile</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your personal information.</p>
        </div>
        <Button variant="outline" onClick={toggleEditing}>
          {editing ? (<><Edit2 size={16} /> Cancel</>) : (<><Edit2 size={16} /> Edit Profile</>)}
        </Button>
      </div>

      <Card>
        <CardHeader><CardTitle>Customer Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { label: "Full Name", value: data?.fullName ?? "-" },
              { label: "Email", value: data?.email ?? "-" },
              { label: "Mobile", value: data?.mobileNumber ?? "-" },
              { label: "Date of Birth", value: data?.dateOfBirth ?? "-" },
              { label: "Address", value: data?.address ?? "-" },
              { label: "City", value: data?.city ?? "-" },
              { label: "State", value: data?.state ?? "-" },
              { label: "PIN Code", value: data?.pinCode ?? "-" },
              { label: "Nominee Name", value: data?.nomineeName ?? "-" },
              { label: "Nominee Relation", value: data?.nomineeRelation ?? "-" },
            ].map((item, i) => (
              <Card key={i}>
                <CardContent className="p-3">
                  <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{item.label}</div>
                  <div className="text-sm font-medium">{item.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {editing && (
            <form onSubmit={(e) => {
              e.preventDefault()
              updateMut.mutate(form)
            }} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label>Date of Birth</Label>
                <Input type="date" value={form.dateOfBirth} onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <Label>Address</Label>
                <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>City</Label>
                  <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>PIN Code</Label>
                  <Input value={form.pinCode} onChange={(e) => setForm({ ...form, pinCode: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Nominee Name</Label>
                  <Input value={form.nomineeName} onChange={(e) => setForm({ ...form, nomineeName: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <Label>Nominee Relation</Label>
                  <Input value={form.nomineeRelation} onChange={(e) => setForm({ ...form, nomineeRelation: e.target.value })} required />
                </div>
              </div>
              <div className="flex flex-wrap gap-2 sm:flex-nowrap">
                <Button type="submit" disabled={updateMut.isPending}>Save Changes</Button>
                <Button type="button" variant="outline" onClick={() => setEditing(false)}>Cancel</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
