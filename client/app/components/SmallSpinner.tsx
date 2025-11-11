"use client"

export default function SmallSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-muted-foreground border-t-primary"></div>
    </div>
  )
}
