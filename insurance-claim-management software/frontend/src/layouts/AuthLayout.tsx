"use client"

import { Outlet } from "react-router-dom"
import { ThemeToggle } from "@/components/ThemeToggle"

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800 dark:bg-gray-900 px-4">
      <div className="relative w-full max-w-md">
        <div className="absolute top-0 right-0 z-50">
          <ThemeToggle />
        </div>
        <Outlet />
      </div>
    </div>
  )
}
