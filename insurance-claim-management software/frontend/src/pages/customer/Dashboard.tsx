"use client"

import React, { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getCustomerDashboard } from "@/services/api"
import { FileText, Shield, Clock, ShieldCheck, Users, RefreshCw, Plus } from "lucide-react"
import { Link } from "react-router-dom"

export default function CustomerDashboard() {
  const { toast } = useToast()
  const { data, isLoading, error } = useQuery({
    queryKey: ["customer-dashboard"],
    queryFn: async () => {
      const res = await getCustomerDashboard()
      return res.data.data
    },
  })

  useEffect(() => {
    if (error) toast({ variant: "destructive", title: "Error", description: "Failed to load dashboard" })
  }, [error, toast])

  if (isLoading) return <div className="flex h-[400px] items-center justify-center"><div className="h-8 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" /></div>

  const d = data || {}
  const cards = [
    { title: "Total Policies", value: d.totalPolicies ?? 0, icon: FileText, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950" },
    { title: "Active Policies", value: d.activePolicies ?? 0, icon: Shield, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950" },
    { title: "Pending Payment", value: d.pendingPaymentPolicies ?? 0, icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950" },
    { title: "Expired Policies", value: d.expiredPolicies ?? 0, icon: Clock, color: "text-gray-600 dark:text-gray-300", bg: "bg-gray-50 dark:bg-gray-900" },
    { title: "Total Claims", value: d.totalClaims ?? 0, icon: FileText, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950" },
    { title: "Claims Under Review", value: d.claimsUnderReview ?? 0, icon: ShieldCheck, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Customer Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your insurance policies and claims.</p>
        </div>
        <Link to="/customer/browse" className="bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
          <Plus size={16} className="mr-2" /> Purchase Policy
        </Link>
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
