"use client"

import React from "react"
import { useAuth } from "@/context/AuthContext"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Mail, Lock, Phone, User } from "lucide-react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { Link, useNavigate } from "react-router-dom"

const schema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  mobileNumber: z.string().regex(/^[0-9+\- ]{7,20}$/, "Enter a valid mobile number"),
})

export default function Register() {
  const { register, isLoading } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const form = useForm<{ fullName: string; email: string; password: string; mobileNumber: string }>({
    resolver: zodResolver(schema),
    defaultValues: { fullName: "", email: "", password: "", mobileNumber: "" },
  })

  const onSubmit = async (data: z.infer<typeof schema>) => {
    try {
      await register({
        fullName: data.fullName ?? "",
        email: data.email ?? "",
        password: data.password ?? "",
        mobileNumber: data.mobileNumber ?? "",
      })
      toast({ title: "Account created", description: "Welcome! You are now signed in." })
      navigate("/customer/dashboard")
    } catch (err: any) {
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: err.response?.data?.message || "Something went wrong",
      })
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto mt-10 shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Create account</CardTitle>
        <CardDescription>Join as a customer. It only takes a minute.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input id="fullName" placeholder="John Doe" {...form.register("fullName")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@example.com" {...form.register("email")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobileNumber">Mobile Number</Label>
            <Input id="mobileNumber" placeholder="+1-555-0000" {...form.register("mobileNumber")} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" minLength={8} {...form.register("password")} />
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Public registration creates a CUSTOMER account only.
          </p>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating..." : "Create account"}
          </Button>
        </form>
      </CardContent>
      <CardFooter className="flex flex-col gap-3">
        <p className="text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            Sign in
          </Link>
        </p>
      </CardFooter>
    </Card>
  )
}
