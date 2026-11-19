"use client"

import React, { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAgentDashboard } from "@/services/api"
import { Users, FileText, CreditCard, Shield, Clock } from "lucide-react"

export default function AgentDashboard() {
  const { toast } = useToast()
  const { data, isLoading, error } = useQuery({
    queryKey: ["agent-dashboard"],
    queryFn: async () => {
      const res = await getAgentDashboard()
      return res.data.data
    },
  })

  useEffect(() => {
    if (error) toast({ variant: "destructive", title: "Error", description: "Failed to load dashboard" })
  }, [error, toast])

  if (isLoading) return <div className="flex h-[400px] items-center justify-center"><div className="h-8 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" /></div>

  const d = data || {}
  const cards = [
    { title: "Claims Submitted", value: d.totalClaimsSubmitted ?? 0, icon: FileText, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950" },
    { title: "Under Review", value: d.totalClaimsUnderReview ?? 0, icon: Shield, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950" },
    { title: "Total Policies", value: d.totalPolicies ?? 0, icon: FileText, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950" },
    { title: "Active Policies", value: d.activePolicies ?? 0, icon: Shield, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950" },
    { title: "Pending Payment", value: d.pendingPaymentPolicies ?? 0, icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950" },
    { title: "Total Customers", value: d.totalCustomers ?? 0, icon: Users, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Agent Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-300">Manage customer policies and review claims.</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((c) => (
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
