"use client"

import React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-800 px-4">
      <Card className="w-full max-w-md">
        <CardContent className="py-10 text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Page not found</h1>
          <p className="text-gray-600 dark:text-gray-300">The page you are looking for does not exist or has moved.</p>
          <Button asChild>
            <Link to="/">Go to dashboard</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
