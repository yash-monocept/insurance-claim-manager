import axios, { AxiosError, InternalAxiosRequestConfig } from "axios"
import type { PageResponse } from "@/types"

const API_BASE = (import.meta as any).env?.VITE_API_BASE || "/api"

export const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
})

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      if (window.location.pathname !== "/login") {
        window.location.href = "/login"
      }
    }
    return Promise.reject(err)
  }
)

export type { AxiosError }

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  fullName: string
  email: string
  password: string
  mobileNumber: string
}

export interface AuthResponse {
  token: string
  tokenType: string
  email: string
  role: string
  fullName?: string
  mobileNumber?: string
  active?: boolean
  expiryTime: number
}

export interface CustomerRequest {
  dateOfBirth: string
  address: string
  city: string
  state: string
  pinCode: string
  nomineeName: string
  nomineeRelation: string
}

export interface CustomerResponse {
  id: number
  fullName: string
  email: string
  mobileNumber: string
  dateOfBirth?: string
  address?: string
  city?: string
  state?: string
  pinCode?: string
  nomineeName?: string
  nomineeRelation?: string
  createdDate: string
  updatedDate: string
}

export interface UserResponse {
  id: number
  fullName: string
  email: string
  mobileNumber: string
  role: string
  active: boolean
  createdDate: string
  updatedDate: string
}

export interface AgentCreationRequest {
  fullName: string
  email: string
  password: string
  mobileNumber: string
}

export interface UserStatusUpdateRequest {
  active: string
  reason?: string
}

export interface ProductRequest {
  productName: string
  productType: "HEALTH" | "MOTOR" | "LIFE" | "TRAVEL"
  description?: string
  active?: boolean
}

export interface ProductResponse {
  id: number
  productName: string
  productType: string
  description?: string
  active: boolean
  createdDate: string
  updatedDate: string
}

export interface PlanRequest {
  productId: number
  planName: string
  coverageAmount: number
  premiumAmount: number
  premiumType: "ONE_TIME" | "ANNUAL"
  durationYears: number
  termsAndConditions?: string
  active?: boolean
}

export interface PlanResponse {
  id: number
  productId: number
  productName: string
  productType: string
  planName: string
  coverageAmount: number
  premiumAmount: number
  premiumType: string
  durationYears: number
  termsAndConditions?: string
  active: boolean
  createdDate: string
  updatedDate: string
}

export interface PolicyPurchaseRequest {
  planId: number
  startDate: string
}

export interface PolicyIssueRequest {
  customerId: number
  planId: number
  startDate: string
}

export interface PolicyResponse {
  id: number
  policyNumber: string
  customerName: string
  customerEmail: string
  planName: string
  productType: string
  coverageAmount: number
  premiumAmount: number
  premiumType: string
  startDate: string
  endDate: string
  policyStatus: string
  totalPremiumPaid: number
  createdDate: string
  updatedDate: string
}

export interface PaymentRequest {
  policyId: number
  amount: number
  paymentMode: "UPI" | "CARD" | "NET_BANKING" | "CASH"
  transactionReference: string
  paymentStatus: "SUCCESS" | "FAILED" | "PENDING"
}

export interface PaymentResponse {
  id: number
  policyNumber: string
  amount: number
  paymentDate: string
  paymentMode: string
  transactionReference: string
  paymentStatus: string
}

export interface ClaimRequest {
  policyId: number
  claimAmount: number
  claimReason: string
  incidentDate: string
  documentName?: string
  documentType?: string
  documentReference?: string
}

export interface ClaimResponse {
  id: number
  claimNumber: string
  policyNumber: string
  customerName: string
  claimAmount: number
  claimReason: string
  incidentDate: string
  claimStatus: string
  agentRemarks?: string
  adminRemarks?: string
  createdDate: string
  updatedDate: string
}

export interface ClaimReviewRequest {
  recommendedStatus: "UNDER_REVIEW"
  remarks: string
}

export interface ClaimRecommendationRequest {
  recommendedStatus: "RECOMMENDED_FOR_APPROVAL" | "RECOMMENDED_FOR_REJECTION"
  remarks: string
}

export interface ClaimDecisionRequest {
  finalStatus: "APPROVED" | "REJECTED"
  remarks: string
}

export interface ClaimStatusHistoryResponse {
  id: number
  previousStatus?: string
  newStatus: string
  remarks?: string
  updatedBy: string
  updatedDate: string
}

export interface ClaimDocumentResponse {
  id: number
  documentName: string
  documentType?: string
  documentReference?: string
  uploadedDate: string
}

// ---------- Auth ----------
export const authLogin = (data: LoginRequest) =>
  api.post<{ data: AuthResponse }>("/auth/login", data)

export const authRegister = (data: RegisterRequest) =>
  api.post<{ data: AuthResponse }>("/auth/register", data)

// ---------- Users ----------
export const getUsers = (params: any) =>
  api.get<{ data: PageResponse<UserResponse> }>("/admin/users", { params })

export const createAgent = (data: AgentCreationRequest) =>
  api.post<{ data: UserResponse }>("/admin/users/agents", data)

export const updateUserStatus = (id: number, data: UserStatusUpdateRequest) =>
  api.patch<{ data: UserResponse }>(`/admin/users/${id}/status`, data)

// ---------- Customers ----------
export const createCustomerProfile = (data: CustomerRequest) =>
  api.post<{ data: CustomerResponse }>("/customers/profile", data)

export const updateCustomerProfile = (data: CustomerRequest) =>
  api.put<{ data: CustomerResponse }>("/customers/me", data)

export const getMyProfile = () =>
  api.get<{ data: CustomerResponse }>("/customers/me")

export const getCustomerById = (id: number) =>
  api.get<{ data: CustomerResponse }>(`/customers/${id}`)

export const getCustomers = (params: any) =>
  api.get<{ data: PageResponse<CustomerResponse> }>("/customers", { params })

// ---------- Products ----------
export const getProducts = (params: any) =>
  api.get<{ data: PageResponse<ProductResponse> }>("/admin/products", { params })

export const createProduct = (data: ProductRequest) =>
  api.post<{ data: ProductResponse }>("/admin/products", data)

export const updateProduct = (id: number, data: ProductRequest) =>
  api.put<{ data: ProductResponse }>(`/admin/products/${id}`, data)

export const toggleProductStatus = (id: number, active: boolean) =>
  api.patch<{ data: ProductResponse }>(`/admin/products/${id}/status`, null, { params: { active } })

export const getPublicProducts = (params: any) =>
  api.get<{ data: PageResponse<ProductResponse> }>("/products", { params })

// ---------- Plans ----------
export const getPlans = (params: any) =>
  api.get<{ data: PageResponse<PlanResponse> }>("/plans", { params })

export const createPlan = (data: PlanRequest) =>
  api.post<{ data: PlanResponse }>("/plans", data)

export const updatePlan = (id: number, data: PlanRequest) =>
  api.put<{ data: PlanResponse }>(`/plans/${id}`, data)

export const togglePlanStatus = (id: number, active: boolean) =>
  api.patch<{ data: PlanResponse }>(`/plans/${id}/status`, null, { params: { active } })

// ---------- Policies ----------
export const purchasePolicy = (data: PolicyPurchaseRequest) =>
  api.post<{ data: PolicyResponse }>("/policies/purchase", data)

export const issuePolicy = (data: PolicyIssueRequest) =>
  api.post<{ data: PolicyResponse }>("/policies/issue", data)

export const getMyPolicies = (params: any) =>
  api.get<{ data: PageResponse<PolicyResponse> }>("/policies/me", { params })

export const getAllPolicies = (params: any) =>
  api.get<{ data: PageResponse<PolicyResponse> }>("/policies", { params })

export const getPolicyById = (id: number) =>
  api.get<{ data: PolicyResponse }>(`/policies/${id}`)

export const cancelPolicy = (id: number) =>
  api.patch<{ data: PolicyResponse }>(`/policies/${id}/cancel`)

// ---------- Payments ----------
export const recordPayment = (data: PaymentRequest) =>
  api.post<{ data: PaymentResponse }>("/payments", data)

export const getMyPayments = (params: any) =>
  api.get<{ data: PageResponse<PaymentResponse> }>("/payments/me", { params })

export const getAllPayments = (params: any) =>
  api.get<{ data: PageResponse<PaymentResponse> }>("/payments", { params })

// ---------- Claims ----------
export const submitClaim = (data: ClaimRequest) =>
  api.post<{ data: ClaimResponse }>("/claims", data)

export const getMyClaims = (params: any) =>
  api.get<{ data: PageResponse<ClaimResponse> }>("/claims/me", { params })

export const getAllClaims = (params: any) =>
  api.get<{ data: PageResponse<ClaimResponse> }>("/claims", { params })

export const getClaimById = (id: number) =>
  api.get<{ data: ClaimResponse }>(`/claims/${id}`)

export const reviewClaim = (id: number, data: ClaimReviewRequest) =>
  api.patch<{ data: ClaimResponse }>(`/claims/${id}/review`, data)

export const recommendClaim = (id: number, data: ClaimRecommendationRequest) =>
  api.patch<{ data: ClaimResponse }>(`/claims/${id}/recommendation`, data)

export const decideClaim = (id: number, data: ClaimDecisionRequest) =>
  api.patch<{ data: ClaimResponse }>(`/claims/${id}/decision`, data)

export const getClaimHistory = (claimId: number, params: any) =>
  api.get<{ data: PageResponse<ClaimStatusHistoryResponse> }>(
    `/claims/${claimId}/history`,
    { params }
  )

export const getClaimDocuments = (claimId: number) =>
  api.get<{ data: ClaimDocumentResponse[] }>(`/claims/${claimId}/documents`)

// ---------- Dashboard ----------
export const getAdminDashboard = () =>
  api.get<{ data: any }>("/dashboard/admin")

export const getAgentDashboard = () =>
  api.get<{ data: any }>("/dashboard/agent")

export const getCustomerDashboard = () =>
  api.get<{ data: any }>("/dashboard/customer")

export const getAnalytics = () =>
  api.get<{ data: any }>("/dashboard/analytics")
