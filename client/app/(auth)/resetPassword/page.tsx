"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { useWeb } from "@/app/context/ContextProvider"
import { useRouter } from "next/navigation"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"
import toast from "react-hot-toast"
import { api } from "@/app/lib/axios"

export default function ResetPasswordPage() {
    const {tempEmail, setTempEmail, tempOTP, setTempOTP} = useWeb();
    const router: AppRouterInstance = useRouter();
    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmNewPassword, setConfirmNewPassword] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
      if (!tempEmail || !tempOTP) {
        router.back();
      }
    },[])

    const resetPassword = async(e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      setLoading(true);

      if (newPassword !== confirmNewPassword) {
        toast.error("New Passwords need to match");
        setLoading(false);
        return;
      }

      try {
        const res = await api.post("/auth/reset-password", { email:tempEmail, otp:tempOTP, newPassword:newPassword });
        const data = res.data;

        toast.success(data.message);
        router.push("/login");

      } catch(err:any) {
        console.error(err);
        toast.error(err?.response?.data?.message || "Internal Server Error");
      } finally {
        setLoading(false)
      }
    }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card text-card-foreground shadow-lg">
        <div className="px-6 pt-6 pb-2">
          <h1 className="text-2xl font-semibold tracking-tight">Set a new password</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a strong password and confirm it to continue
          </p>
        </div>

        <div className="px-6 pb-6">
          <form onSubmit={resetPassword} method="post" className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="newPassword" className="text-sm font-medium">
                New password
              </label>
              <input
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                id="newPassword"
                name="newPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Create a strong password"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <p className="text-xs text-muted-foreground">
                Use at least 6 characters
              </p>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm new password
              </label>
              <input
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                autoComplete="new-password"
                placeholder="Re-enter your new password"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <Button
              disabled={!newPassword || !confirmNewPassword}
              type="submit"
              className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Update Password
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <Link href="/login" className="text-primary hover:underline">
              Back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
