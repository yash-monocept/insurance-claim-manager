export interface User {
  id: number
  fullName: string
  email: string
  mobileNumber: string
  role: "ADMIN" | "AGENT" | "CUSTOMER"
  active: boolean
  createdDate: string
  updatedDate: string
}

export interface Customer {
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

export interface InsuranceProduct {
  id: number
  productName: string
  productType: "HEALTH" | "MOTOR" | "LIFE" | "TRAVEL"
  description?: string
  active: boolean
  createdDate: string
  updatedDate: string
}

export interface PolicyPlan {
  id: number
  productId: number
  productName: string
  productType: string
  planName: string
  coverageAmount: number
  premiumAmount: number
  premiumType: "ONE_TIME" | "ANNUAL"
  durationYears: number
  termsAndConditions?: string
  active: boolean
  createdDate: string
  updatedDate: string
}

export interface Policy {
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
  policyStatus: "PENDING_PAYMENT" | "ACTIVE" | "EXPIRED" | "CANCELLED"
  totalPremiumPaid: number
  createdDate: string
  updatedDate: string
}

export interface PremiumPayment {
  id: number
  policyNumber: string
  amount: number
  paymentDate: string
  paymentMode: "UPI" | "CARD" | "NET_BANKING" | "CASH"
  transactionReference: string
  paymentStatus: "SUCCESS" | "FAILED" | "PENDING"
}

export interface Claim {
  id: number
  claimNumber: string
  policyNumber: string
  customerName: string
  claimAmount: number
  claimReason: string
  incidentDate: string
  claimStatus:
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "RECOMMENDED_FOR_APPROVAL"
    | "RECOMMENDED_FOR_REJECTION"
    | "APPROVED"
    | "REJECTED"
  agentRemarks?: string
  adminRemarks?: string
  createdDate: string
  updatedDate: string
}

export interface ClaimStatusHistory {
  id: number
  previousStatus?: string
  newStatus: string
  remarks?: string
  updatedBy: string
  updatedDate: string
}

export interface AuthResponse {
  token: string
  tokenType: string
  email: string
  role: string
  expiryTime: number
  fullName?: string
  active?: boolean
}

export interface ApiResponse<T = any> {
  success: boolean
  message: string
  data: T | null
  timestamp: string
}

export interface PageResponse<T = any> {
  records: T[]
  currentPage: number
  pageSize: number
  totalRecords: number
  totalPages: number
  lastPage: boolean
  sortField?: string
  sortDirection?: string
}

export interface DashboardData {
  [key: string]: any
}
