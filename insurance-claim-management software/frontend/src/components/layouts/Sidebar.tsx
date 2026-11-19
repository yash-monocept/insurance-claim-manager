"use client"

import React from "react"
import { useAuth } from "@/context/AuthContext"
import { Link, useLocation } from "react-router-dom"
import { Menu, X, User, LogOut } from "lucide-react"
import {
  LayoutDashboard,
  Shield,
  FileText,
  CreditCard,
  FilePlus,
  ClipboardList,
  Users,
  UserRound,
  UserCog,
  List,
  ClipboardCheck,
  BarChart3,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { navItems } from "@/components/nav"
import { ThemeToggle } from "@/components/ThemeToggle"

export function Sidebar({ role, user, onLogout }: { role: string; user: any; onLogout: () => void }) {
  const [open, setOpen] = React.useState(false)
  const items = navItems(role)

  return (
    <>
      <button
        className="md:hidden p-2 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        onClick={() => setOpen(!open)}
      >
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300 md:translate-x-0 md:relative md:static",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-blue-900 dark:bg-blue-800 flex items-center justify-center text-white font-bold text-lg">I</div>
            <span className="text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">InsurePro</span>
          </div>
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <button
              className="md:hidden p-1 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
              onClick={() => setOpen(false)}
            >
              <X size={22} />
            </button>
          </div>
        </div>
        <nav className="px-2 py-4 space-y-1">
          {items.map((item) => (
            <div key={item.href} className="px-2">
              {item.items ? (
                <div>
                  <button className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100">
                    <span className="text-gray-400 dark:text-gray-300">{item.title}</span>
                  </button>
                  <div className="space-y-0.5 ml-8">
                    {item.items.map((sub) => (
                      <Link
                        key={sub.href}
                        to={sub.href}
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
                      >
                        {sub.title}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  to={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    "text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100",
                  )}
                >
                  <span className="text-gray-400 dark:text-gray-300 shrink-0">{getIcon(item.icon)}</span>
                  {item.title}
                </Link>
              )}
            </div>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-300">
              <User size={20} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user?.fullName ?? "User"}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email ?? ""}</p>
            </div>
            <button
              onClick={onLogout}
              className="text-xs font-medium text-destructive hover:text-destructive/90 px-2 py-1"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </div>
      </aside>
      {open && (
        <div
          className="fixed inset-0 z-20 bg-black/40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  )
}

const ICONS: Record<string, React.ComponentType<{ size?: number | string; className?: string }>> = {
  Dashboard: LayoutDashboard,
  Shield,
  FileText,
  CreditCard,
  FilePlus,
  ClipboardList,
  User,
  Users,
  UserRound,
  UserCog,
  List,
  ClipboardCheck,
  BarChart3,
}

function getIcon(name: string | undefined): React.ReactNode {
  const Icon = name ? ICONS[name] : undefined
  return Icon ? <Icon size={18} className="shrink-0" /> : null
}

export function TopNav({ user, onLogout }: { user: any; onLogout: () => void }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6">
      <div className="flex items-center gap-4">
        <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
          {user?.role?.charAt(0) + user?.role?.slice(1).toLowerCase()} Portal
        </span>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden md:block text-xs text-gray-500 dark:text-gray-400">
          {user?.email}
        </span>
        <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center text-gray-500 dark:text-gray-300">
          {user?.fullName?.charAt(0) ?? "U"}
        </div>
      </div>
    </header>
  )
}
