"use client"

import React from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { useQuery, useMutation } from "@tanstack/react-query"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { getPlans, purchasePolicy } from "@/services/api"
import { ArrowLeft, Shield } from "lucide-react"

function localToday() {
  const now = new Date()
  return new Date(now.getTime() - now.getTimezoneOffset() * 60000).toISOString().slice(0, 10)
}

export default function CustomerProductPlans() {
  const { productId } = useParams()
  const { toast } = useToast()
  const navigate = useNavigate()

  const { data, isLoading, isError } = useQuery({
    queryKey: ["plans", productId],
    queryFn: async () => {
      const res = await getPlans({ page: 1, size: 50, productId: Number(productId), active: true })
      return res.data.data.records
    },
    enabled: !!productId,
  })

  const buyMut = useMutation({
    mutationFn: (planId: number) =>
      purchasePolicy({ planId, startDate: localToday() }),
    onSuccess: () => {
      toast({ title: "Policy purchased", description: "Complete the premium payment from My Policies." })
      navigate("/customer/policies")
    },
    onError: (e: any) =>
      toast({ variant: "destructive", title: "Purchase failed", description: e.response?.data?.message || "Please try again." }),
  })

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-3 -ml-2">
          <Link to="/customer/browse"><ArrowLeft size={16} /> Back to products</Link>
        </Button>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Available Plans</h1>
        <p className="text-gray-600 dark:text-gray-300">Choose a plan that fits your needs.</p>
      </div>

      {isLoading && (
        <div className="flex h-[300px] items-center justify-center">
          <div className="h-8 w-32 animate-pulse rounded-full bg-gray-200 dark:bg-gray-700" />
        </div>
      )}

      {isError && (
        <Card>
          <CardContent className="py-10 text-center text-gray-500 dark:text-gray-400">
            Could not load plans. Please try again.
          </CardContent>
        </Card>
      )}

      {!isLoading && !isError && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data || []).map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{plan.planName}</CardTitle>
                  <Badge variant="outline">{plan.productType}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <Shield size={16} /> Coverage: ₹{plan.coverageAmount?.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Premium: ₹{plan.premiumAmount?.toLocaleString()} ({plan.premiumType.replace(/_/g, " ").toLowerCase()})
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Duration: {plan.durationYears} yr</div>
                {plan.termsAndConditions && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">{plan.termsAndConditions}</p>
                )}
                <Button
                  className="w-full"
                  onClick={() => buyMut.mutate(plan.id)}
                  disabled={buyMut.isPending}
                >
                  {buyMut.isPending ? "Purchasing..." : "Buy Plan"}
                </Button>
              </CardContent>
            </Card>
          ))}
          {(data || []).length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
              No plans available for this product yet.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
