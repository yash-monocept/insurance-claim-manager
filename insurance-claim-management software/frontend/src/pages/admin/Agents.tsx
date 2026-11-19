"use client"

import React, { useEffect, useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { getUsers } from "@/services/api"
import { Search, UserRound } from "lucide-react"

export default function AdminAgents() {
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const { data, isLoading } = useQuery({
    queryKey: ["agents", search],
    queryFn: async () => {
      const res = await getUsers({ page: 1, size: 100, role: "AGENT", keyword: search })
      return res.data.data.records
    },
  })

  if (isLoading) return <div className="flex h-[300px] items-center justify-center"><div className="h-8 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" /></div>

  const agents = (data || []).filter((u: any) => u.role === "AGENT")

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Agents</h1>
          <p className="text-gray-600 dark:text-gray-300">Insurance organisation agents.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-400" />
          <Input placeholder="Search agents..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Agent Directory</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {agents.map((a: any) => (
                  <TableRow key={a.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400">
                          <UserRound size={18} />
                        </div>
                        <div className="text-sm font-medium">{a.fullName}</div>
                      </div>
                    </TableCell>
                    <TableCell>{a.email}</TableCell>
                    <TableCell>{a.mobileNumber}</TableCell>
                    <TableCell>{statusBadge(a.active)}</TableCell>
                  </TableRow>
                ))}
                {agents.length === 0 && (
                  <TableRow><TableCell colSpan={4} className="text-center py-8 text-gray-500 dark:text-gray-400">No agents found.</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function statusBadge(active: boolean) {
  return <Badge variant={active ? "default" : "secondary"}>{active ? "Active" : "Inactive"}</Badge>
}
