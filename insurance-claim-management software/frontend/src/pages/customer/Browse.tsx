"use client"

import React, { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { getPublicProducts } from "@/services/api"
import { Search, Shield } from "lucide-react"

export default function CustomerBrowse() {
  const { toast } = useToast()
  const [search, setSearch] = useState("")
  const { data, isLoading } = useQuery({
    queryKey: ["browse-products", search],
    queryFn: async () => {
      const res = await getPublicProducts({ page: 1, size: 50, keyword: search })
      return res.data.data.records
    },
  })

  if (isLoading) return <div className="flex h-[400px] items-center justify-center"><div className="h-8 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" /></div>

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Browse Insurance</h1>
          <p className="text-gray-600 dark:text-gray-300">Explore available insurance products and plans.</p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-400" />
          <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {(data || []).map((p: any) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle>{p.productName}</CardTitle>
              <Badge variant="outline">{p.productType}</Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{p.description ?? "No description available."}</p>
              <Button variant="outline" asChild>
                <Link to={`/customer/browse/${p.id}`}>View Plans</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
        {(data || []).length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">No products found.</div>
        )}
      </div>
    </div>
  )
}
