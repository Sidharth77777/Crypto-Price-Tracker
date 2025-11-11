"use client"

import { Toaster } from "react-hot-toast"

export function AppToaster() {
  return (
    <Toaster
      position="top-center"
      gutter={8}
      toastOptions={{
        duration: 3000,
        style: {
          background: "var(--card)",
          color: "var(--card-foreground)",
          border: "1px solid var(--border)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          borderRadius: "0.75rem",
        },
        success: {
          style: {
            background: "var(--card)",
            color: "var(--primary)",
            border: "1px solid var(--primary)",
          },
          iconTheme: {
            primary: "var(--primary)",
            secondary: "var(--card)",
          },
        },
        error: {
          style: {
            background: "var(--card)",
            color: "var(--destructive)",
            border: "1px solid var(--destructive)",
          },
          iconTheme: {
            primary: "var(--destructive)",
            secondary: "var(--card)",
          },
        },
      }}
    />
  )
}
