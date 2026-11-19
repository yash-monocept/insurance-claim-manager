"use client"

import { toast as sonnerToast } from "sonner"

type Toast = {
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

export function toast({ title, description, variant }: Toast = {}) {
  const message = title ?? description ?? ""
  const options = title && description ? { description } : undefined

  if (variant === "destructive") {
    return sonnerToast.error(message, options)
  }
  return sonnerToast(message, options)
}

export function useToast() {
  return { toast }
}
