"use client"

export default function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-10 w-10 animate-spin rounded-full border-2 border-muted-foreground border-t-primary"></div>
    </div>
  )
}
