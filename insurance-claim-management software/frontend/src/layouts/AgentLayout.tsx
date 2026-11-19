"use client"

import { Outlet } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Sidebar, TopNav } from "@/components/layouts/Sidebar"

export default function AgentLayout() {
  const { user, logout } = useAuth()
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar role="AGENT" user={user} onLogout={logout} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav user={user} onLogout={logout} />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
