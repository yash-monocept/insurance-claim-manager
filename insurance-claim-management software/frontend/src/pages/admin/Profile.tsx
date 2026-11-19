"use client"

import React from "react"
import { useAuth } from "@/context/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminProfile() {
  const { user } = useAuth()
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Profile</h1>
        <p className="text-gray-600 dark:text-gray-300">Admin account settings.</p>
      </div>
      <Card>
        <CardHeader><CardTitle>Admin Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</div>
                <div className="text-sm font-medium">{user?.fullName ?? "-"}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</div>
                <div className="text-sm font-medium">{user?.email ?? "-"}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Role</div>
                <div className="text-sm font-medium">{user?.role ?? "-"}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-3">
                <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</div>
                <div className="text-sm font-medium">{user?.active ? "Active" : "Inactive"}</div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
