"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export interface NavItem {
  title: string
  href: string
  icon?: string
  badge?: string
  items?: NavItem[]
}

export const navItems = (role: string): NavItem[] => {
  const customerItems: NavItem[] = [
    { title: "Dashboard", href: "/customer/dashboard", icon: "Dashboard" },
    { title: "Browse Insurance", href: "/customer/browse", icon: "Shield" },
    { title: "My Policies", href: "/customer/policies", icon: "FileText" },
    { title: "Payments", href: "/customer/payments", icon: "CreditCard" },
    { title: "Raise Claim", href: "/customer/claims/raise", icon: "FilePlus" },
    { title: "My Claims", href: "/customer/claims", icon: "ClipboardList" },
    { title: "Profile", href: "/customer/profile", icon: "User" },
  ]

  const agentItems: NavItem[] = [
    { title: "Dashboard", href: "/agent/dashboard", icon: "Dashboard" },
    { title: "Customers", href: "/agent/customers", icon: "Users" },
    { title: "Policies", href: "/agent/policies", icon: "FileText" },
    { title: "Payments", href: "/agent/payments", icon: "CreditCard" },
    { title: "Claim Review", href: "/agent/claims/review", icon: "ClipboardCheck" },
    { title: "Claims", href: "/agent/claims", icon: "ClipboardList" },
    { title: "Issue Policy", href: "/agent/policies/issue", icon: "FilePlus" },
    { title: "Profile", href: "/agent/profile", icon: "User" },
  ]

  const adminItems: NavItem[] = [
    { title: "Dashboard", href: "/admin/dashboard", icon: "Dashboard" },
    { title: "Products", href: "/admin/products", icon: "Shield" },
    { title: "Plans", href: "/admin/plans", icon: "List" },
    { title: "Customers", href: "/admin/customers", icon: "Users" },
    { title: "Agents", href: "/admin/agents", icon: "UserRound" },
    { title: "Users", href: "/admin/users", icon: "UserCog" },
    { title: "All Policies", href: "/admin/policies", icon: "FileText" },
    { title: "Issue Policy", href: "/admin/policies/issue", icon: "FilePlus" },
    { title: "Payments", href: "/admin/payments", icon: "CreditCard" },
    { title: "Claims", href: "/admin/claims", icon: "ClipboardList" },
    { title: "Reports", href: "/admin/reports", icon: "BarChart3" },
    { title: "Profile", href: "/admin/profile", icon: "User" },
  ]

  if (role === "ADMIN") return adminItems
  if (role === "AGENT") return agentItems
  return customerItems
}

export function NavGroup({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div className="px-2">
      <h2 className="px-3 text-xs font-semibold text-muted-foreground mb-2">{title}</h2>
      <div className="space-y-0.5">
        {items.map((item) => (
          <NavLink key={item.href} item={item} />
        ))}
      </div>
    </div>
  )
}

function NavLink({ item }: { item: NavItem }) {
  return (
    <a
      href={item.href}
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2 text-sm text-foreground transition-colors",
        "hover:bg-accent hover:text-accent-foreground",
      )}
    >
      <span className="text-muted-foreground shrink-0" aria-hidden="true">
        {getIcon(item.icon)}
      </span>
      <span className="text-foreground">{item.title}</span>
      {item.badge && (
        <Badge variant="secondary" className="ml-auto">
          {item.badge}
        </Badge>
      )}
    </a>
  )
}

function getIcon(name: string | undefined): React.ReactNode {
  const icons: Record<string, React.ComponentType<{ className?: string }>> = {}
  return null
}
