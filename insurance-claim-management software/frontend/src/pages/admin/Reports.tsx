"use client"

import React, { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts"
import { getAnalytics } from "@/services/api"
import { Shield, FileText, CreditCard, Users } from "lucide-react"

export default function AdminReports() {
  const { toast } = useToast()
  const { data, isLoading, error } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => { const r = await getAnalytics(); return r.data.data },
  })

  useEffect(() => {
    if (error) toast({ variant: "destructive", title: "Error", description: "Failed to load analytics" })
  }, [error, toast])

  if (isLoading) return <div className="flex h-[500px] items-center justify-center"><div className="h-8 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" /></div>

  const d = data || {}
  const toPairs = (v: any): Array<{ name: string; value: number }> => {
    if (!v) return []
    if (Array.isArray(v)) return v.map((p: any) => ({ name: String(p[0]), value: Number(p[1]) || 0 }))
    return Object.entries(v).map(([name, value]) => ({ name, value: Number(value) || 0 }))
  }
  const policiesByStatus = toPairs(d.policiesByStatus)
  const claimsByStatus = toPairs(d.claimsByStatus)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Reports &amp; Analytics</h1>
        <p className="text-gray-600 dark:text-gray-300">System-level summary and business metrics.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Policies by Status</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={policiesByStatus}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                  >
                    <Tooltip />
                    {["#1e3a8a","#3b82f6","#10b981","#f59e0b","#ef4444"].map((c, i) => <Cell key={`c${i}`} fill={c} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Claims by Status</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={claimsByStatus}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[ {title:"Total Policies", value: d.totalPolicies ?? 0, icon: Shield}, {title:"Total Claims", value: d.totalClaims ?? 0, icon: FileText}, {title:"Total Customers", value: d.totalCustomers ?? 0, icon: Users}, {title:"Total Payments", value: d.totalSuccessfulPayments ?? 0, icon: CreditCard} ].map((c) => (
          <Card key={c.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{c.title}</CardTitle>
              <div className="p-2 rounded-md bg-gray-100 dark:bg-gray-800"><c.icon className="h-4 w-4 text-gray-600 dark:text-gray-300" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{c.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
