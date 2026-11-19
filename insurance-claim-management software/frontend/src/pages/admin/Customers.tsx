"use client"

import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getCustomers } from "@/services/api"
import { Search, User } from "lucide-react"

export default function AdminCustomers() {
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const { data, isLoading } = useQuery({
    queryKey: ["customers", search],
    queryFn: async () => {
      const res = await getCustomers({ page: 1, size: 100, keyword: search })
      return res.data.data.records
    },
  })

  if (isLoading) return <div className="flex h-[300px] items-center justify-center"><div className="h-8 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Customers</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage customer profiles.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-400" />
          <Input placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <Card>
        <CardHeader><CardTitle>Customer Directory</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Mobile</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data || []).map((c: any) => (
                  <TableRow key={c.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                          <User size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-medium">{c.fullName}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Customer ID: #{c.id}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{c.email}</TableCell>
                    <TableCell>{c.mobileNumber}</TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-300">{[c.city, c.state].filter(Boolean).join(", ") || "-"}</TableCell>
                    <TableCell className="text-right">
                      <Button size="sm" asChild>
                        <Link to={`/admin/customers/${c.id}`}>View</Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

