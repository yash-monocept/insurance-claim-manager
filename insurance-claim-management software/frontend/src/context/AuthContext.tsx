"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { authLogin, authRegister, type AuthResponse, type RegisterRequest } from "@/services/api"

interface AuthContextType {
  token: string | null
  user: AuthResponse | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const VALID_ROLES = ["ADMIN", "AGENT", "CUSTOMER"]

/**
 * Reads a persisted session and discards anything unusable. A token without a
 * matching user (or an old user object without a valid role) causes redirect
 * loops and blank screens, so it is cleared instead.
 */
function readSession(): { token: string | null; user: AuthResponse | null } {
  const token = localStorage.getItem("token")
  const raw = localStorage.getItem("user")
  if (!token || !raw) {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    return { token: null, user: null }
  }
  try {
    const user = JSON.parse(raw) as AuthResponse
    if (!user || !VALID_ROLES.includes(user.role)) throw new Error("invalid session")
    return { token, user }
  } catch {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    return { token: null, user: null }
  }
}

const initialSession = readSession()

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(initialSession.token)
  const [user, setUser] = useState<AuthResponse | null>(initialSession.user)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const isAuthenticated = !!token

  const login = async (email: string, password: string) => {
    const res = await authLogin({ email, password })
    const data = res.data.data
    setToken(data.token)
    setUser(data)
    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(data))
  }

  const register = async (data: RegisterRequest) => {
    const res = await authRegister(data)
    const d = res.data.data
    setToken(d.token)
    setUser(d)
    localStorage.setItem("token", d.token)
    localStorage.setItem("user", JSON.stringify(d))
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within AuthProvider")
  return ctx
}
