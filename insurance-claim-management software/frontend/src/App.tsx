import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { useAuth, AuthProvider } from "@/context/AuthContext"
import { ThemeProvider, useTheme } from "@/context/ThemeContext"
import { Toaster } from "sonner"

// Layouts
import AdminLayout from "@/layouts/AdminLayout"
import AgentLayout from "@/layouts/AgentLayout"
import CustomerLayout from "@/layouts/CustomerLayout"
import AuthLayout from "@/layouts/AuthLayout"

// Admin pages
import AdminDashboard from "@/pages/admin/Dashboard"
import AdminProducts from "@/pages/admin/Products"
import AdminPlans from "@/pages/admin/Plans"
import AdminCustomers from "@/pages/admin/Customers"
import AdminAgents from "@/pages/admin/Agents"
import AdminUsers from "@/pages/admin/Users"
import AdminPolicies from "@/pages/admin/Policies"
import AdminIssuePolicy from "@/pages/admin/IssuePolicy"
import AdminPayments from "@/pages/admin/Payments"
import AdminClaims from "@/pages/admin/Claims"
import AdminReports from "@/pages/admin/Reports"
import AdminProfile from "@/pages/admin/Profile"

// Agent pages
import AgentDashboard from "@/pages/agent/Dashboard"
import AgentCustomers from "@/pages/agent/Customers"
import AgentPolicies from "@/pages/agent/Policies"
import AgentPayments from "@/pages/agent/Payments"
import AgentClaimReview from "@/pages/agent/ClaimReview"
import AgentClaims from "@/pages/agent/Claims"
import AgentIssuePolicy from "@/pages/agent/IssuePolicy"
import AgentProfile from "@/pages/agent/Profile"

// Customer pages
import CustomerDashboard from "@/pages/customer/Dashboard"
import CustomerBrowse from "@/pages/customer/Browse"
import CustomerPolicies from "@/pages/customer/Policies"
import CustomerPayments from "@/pages/customer/Payments"
import CustomerRaiseClaim from "@/pages/customer/RaiseClaim"
import CustomerClaims from "@/pages/customer/Claims"
import CustomerProfile from "@/pages/customer/Profile"
import CustomerProductPlans from "@/pages/customer/ProductPlans"

// Shared detail pages
import PolicyDetail from "@/pages/shared/PolicyDetail"
import ClaimDetail from "@/pages/shared/ClaimDetail"
import CustomerDetail from "@/pages/shared/CustomerDetail"
import NotFound from "@/pages/shared/NotFound"

// Auth pages
import Login from "@/pages/auth/Login"
import Register from "@/pages/auth/Register"

// Public marketing site
import Landing from "@/pages/Landing"

const LoadingScreen = () => (
  <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 dark:border-gray-600 border-t-blue-600 dark:border-t-blue-400" />
      <p className="text-sm text-gray-500 dark:text-gray-400">Loading…</p>
    </div>
  </div>
)

const AdminOnly = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth()
  if (isLoading) return <LoadingScreen />
  if (!user || user.role !== "ADMIN") return <Navigate to="/login" replace />
  return <>{children}</>
}

const AgentOrAdmin = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth()
  if (isLoading) return <LoadingScreen />
  if (!user || (user.role !== "ADMIN" && user.role !== "AGENT"))
    return <Navigate to="/login" replace />
  return <>{children}</>
}

const CustomerOnly = ({ children }: { children: React.ReactNode }) => {
  const { user, isLoading } = useAuth()
  if (isLoading) return <LoadingScreen />
  if (!user || user.role !== "CUSTOMER") return <Navigate to="/login" replace />
  return <>{children}</>
}

// Sends signed-in users to their dashboard, everyone else to the login page.
const dashboardForRole = (role?: string) => {
  if (role === "ADMIN") return "/admin/dashboard"
  if (role === "AGENT") return "/agent/dashboard"
  return "/customer/dashboard"
}

// Keeps signed-in users off the login/register screens.
const GuestOnly = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth()
  if (user) return <Navigate to={dashboardForRole(user.role)} replace />
  return <>{children}</>
}

function AppInner() {
  const { isLoading } = useAuth()
  const { theme } = useTheme()

  if (isLoading) return <LoadingScreen />

  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <ErrorBoundary>
        <Routes>
        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<GuestOnly><Login /></GuestOnly>} />
          <Route path="/register" element={<GuestOnly><Register /></GuestOnly>} />
        </Route>

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <AdminOnly>
              <AdminLayout />
            </AdminOnly>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="plans" element={<AdminPlans />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="customers/:id" element={<CustomerDetail />} />
          <Route path="agents" element={<AdminAgents />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="policies" element={<AdminPolicies />} />
          <Route path="policies/issue" element={<AdminIssuePolicy />} />
          <Route path="policies/:id" element={<PolicyDetail backTo="/admin/policies" />} />
          <Route path="payments" element={<AdminPayments />} />
          <Route path="claims" element={<AdminClaims />} />
          <Route path="claims/:id" element={<ClaimDetail backTo="/admin/claims" />} />
          <Route path="reports" element={<AdminReports />} />
          <Route path="profile" element={<AdminProfile />} />
        </Route>

        {/* Agent */}
        <Route
          path="/agent"
          element={
            <AgentOrAdmin>
              <AgentLayout />
            </AgentOrAdmin>
          }
        >
          <Route index element={<AgentDashboard />} />
          <Route path="dashboard" element={<AgentDashboard />} />
          <Route path="customers" element={<AgentCustomers />} />
          <Route path="policies" element={<AgentPolicies />} />
          <Route path="payments" element={<AgentPayments />} />
          <Route path="claims/review" element={<AgentClaimReview />} />
          <Route path="claims" element={<AgentClaims />} />
          <Route path="claims/:id" element={<ClaimDetail backTo="/agent/claims" />} />
          <Route path="policies/issue" element={<AgentIssuePolicy />} />
          <Route path="profile" element={<AgentProfile />} />
        </Route>

        {/* Customer */}
        <Route
          path="/customer"
          element={
            <CustomerOnly>
              <CustomerLayout />
            </CustomerOnly>
          }
        >
          <Route index element={<CustomerDashboard />} />
          <Route path="dashboard" element={<CustomerDashboard />} />
          <Route path="browse" element={<CustomerBrowse />} />
          <Route path="browse/:productId" element={<CustomerProductPlans />} />
          <Route path="policies" element={<CustomerPolicies />} />
          <Route path="payments" element={<CustomerPayments />} />
          <Route path="claims/raise" element={<CustomerRaiseClaim />} />
          <Route path="claims" element={<CustomerClaims />} />
          <Route path="claims/:id" element={<ClaimDetail backTo="/customer/claims" />} />
          <Route path="profile" element={<CustomerProfile />} />
        </Route>

        {/* Public marketing site */}
        <Route path="/" element={<Landing />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      </ErrorBoundary>
      <Toaster richColors position="top-right" theme={theme} />
    </BrowserRouter>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppInner />
      </AuthProvider>
    </ThemeProvider>
  )
}
