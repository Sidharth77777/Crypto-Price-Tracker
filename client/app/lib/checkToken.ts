"use client"

// src/lib/auth.ts
export const hasToken = () =>
  typeof window !== "undefined" && !!localStorage.getItem("token")


