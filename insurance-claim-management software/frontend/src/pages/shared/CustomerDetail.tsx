"use client"

import React from "react"
import { Link, useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getCustomerById } from "@/services/api"
import { ArrowLeft, User } from "lucide-react"

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">{label}</div>
      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{value ?? "-"}</div>
    </div>
  )
}

export default function CustomerDetail() {
  const { id } = useParams()
  const { data: customer, isLoading, isError } = useQuery({
    queryKey: ["customer", id],
    queryFn: async () => {
      const res = await getCustomerById(Number(id))
      return res.data.data
    },
    enabled: !!id,
  })

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-3 -ml-2">
          <Link to="/admin/customers"><ArrowLeft size={16} /> Back to customers</Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Customer Details</h1>
        <p className="text-gray-600 dark:text-gray-300">Profile and nominee information.</p>
      </div>

      {isLoading && (
        <div className="flex h-[300px] items-center justify-center">
          <div className="h-8 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
      )}

      {(isError || (!isLoading && !customer)) && (
        <Card>
          <CardContent className="py-10 text-center text-gray-500 dark:text-gray-400">Customer not found.</CardContent>
        </Card>
      )}

      {customer && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-500 dark:text-gray-400">
                <User size={20} />
              </div>
              <div>
                <CardTitle>{customer.fullName}</CardTitle>
                <p className="text-sm text-gray-500 dark:text-gray-400">Customer ID: #{customer.id}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <Field label="Email" value={customer.email} />
            <Field label="Mobile" value={customer.mobileNumber} />
            <Field label="Date of Birth" value={customer.dateOfBirth} />
            <Field label="Address" value={customer.address} />
            <Field label="City" value={customer.city} />
            <Field label="State" value={customer.state} />
            <Field label="PIN Code" value={customer.pinCode} />
            <Field label="Nominee" value={customer.nomineeName} />
            <Field label="Nominee Relation" value={customer.nomineeRelation} />
            <Field label="Created" value={customer.createdDate} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}
