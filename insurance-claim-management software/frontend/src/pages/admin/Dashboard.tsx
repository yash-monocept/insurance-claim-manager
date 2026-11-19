"use client"

import React, { useEffect, useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAdminDashboard } from "@/services/api"
import {
  BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts"
import { Activity, Users, FileText, CreditCard, Shield, Clock } from "lucide-react"

const COLORS = ["#1e3a8a", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"]

export default function AdminDashboard() {
  const { toast } = useToast()
  const { data, isLoading, error } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await getAdminDashboard()
      return res.data.data
    },
  })

  useEffect(() => {
    if (error) toast({ variant: "destructive", title: "Error", description: "Failed to load dashboard" })
  }, [error, toast])

  if (isLoading) return <div className="flex h-[400px] items-center justify-center"><div className="h-8 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" /></div>

  const d = data || {}
  const statCards = [
    { title: "Total Users", value: d.totalUsers ?? 0, icon: Users, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950" },
    { title: "Total Customers", value: d.totalCustomers ?? 0, icon: Users, color: "text-green-600 dark:text-green-400", bg: "bg-green-50 dark:bg-green-950" },
    { title: "Total Agents", value: d.totalAgents ?? 0, icon: Users, color: "text-purple-600 dark:text-purple-400", bg: "bg-purple-50 dark:bg-purple-950" },
    { title: "Total Policies", value: d.totalPolicies ?? 0, icon: FileText, color: "text-indigo-600 dark:text-indigo-400", bg: "bg-indigo-50 dark:bg-indigo-950" },
    { title: "Active Policies", value: d.activePolicies ?? 0, icon: Shield, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950" },
    { title: "Pending Payment", value: d.pendingPaymentPolicies ?? 0, icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950" },
    { title: "Expired Policies", value: d.expiredPolicies ?? 0, icon: Clock, color: "text-gray-600 dark:text-gray-300", bg: "bg-gray-50 dark:bg-gray-900" },
    { title: "Cancelled Policies", value: d.cancelledPolicies ?? 0, icon: FileText, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950" },
    { title: "Total Claims", value: d.totalClaims ?? 0, icon: FileText, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-50 dark:bg-blue-950" },
    { title: "Claims Pending Review", value: d.claimsSubmitted ?? 0, icon: Clock, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-50 dark:bg-amber-950" },
    { title: "Claims Approved", value: d.claimsApproved ?? 0, icon: Activity, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-50 dark:bg-emerald-950" },
    { title: "Claims Rejected", value: d.claimsRejected ?? 0, icon: Activity, color: "text-red-600 dark:text-red-400", bg: "bg-red-50 dark:bg-red-950" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Admin Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">System overview and key metrics</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((card, i) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={cn("p-3 rounded-md", card.bg)}>
                <card.icon className={cn("h-4 w-4", card.color)} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Policies by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <PieChart width={400} height={300}>
                <Pie
                  data={[
                    { name: "Active", value: d.activePolicies ?? 0, fill: COLORS[0] },
                    { name: "Pending Payment", value: d.pendingPaymentPolicies ?? 0, fill: COLORS[3] },
                    { name: "Expired", value: d.expiredPolicies ?? 0, fill: COLORS[4] },
                    { name: "Cancelled", value: d.cancelledPolicies ?? 0, fill: COLORS[2] },
                  ]}
                  cx={200}
                  cy={150}
                  innerRadius={60}
                  outerRadius={120}
                  dataKey="value"
                >
                  {COLORS.map((color, i) => <Cell key={`cell-${i}`} fill={color} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Claims by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <BarChart width={400} height={300} data={[
                { name: "Submitted", value: d.claimsSubmitted ?? 0 },
                { name: "Under Review", value: d.claimsUnderReview ?? 0 },
                { name: "Approved", value: d.claimsApproved ?? 0 },
                { name: "Rejected", value: d.claimsRejected ?? 0 },
              ]}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#1e3a8a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ")
}
