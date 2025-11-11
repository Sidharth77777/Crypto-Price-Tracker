"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useWeb } from "@/app/context/ContextProvider"
import toast from "react-hot-toast";
import { api } from "@/app/lib/axios";
import { useState } from "react";
import SmallSpinner from "@/app/components/SmallSpinner";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function ForgotPasswordPage() {
  const router: AppRouterInstance = useRouter();
  const {tempEmail, setTempEmail} = useWeb();
  const [loading, setLoading] = useState<boolean>(false);

  const submitMail = async(e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/forgot-password", { email: tempEmail });
      const data = res.data;

      toast.success(data.message);
      router.push("/verifyOtp");

    } catch (err:any) {
      console.error(err);
      setTempEmail("");
      toast.error(err?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card text-card-foreground shadow-lg">
        
        <div className="px-6 pt-6 pb-2">
          <h1 className="text-2xl font-semibold tracking-tight">Reset your password</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter your email and we'll send you a password reset link.
          </p>
        </div>

        <div className="px-6 pb-6">
          <form onSubmit={submitMail} method="post" className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                value={tempEmail}
                onChange={(e) => setTempEmail(e.target.value)}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <Button
                disabled={!tempEmail}
              type="submit"
              className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? <SmallSpinner /> : "Send Reset Link"}
            </Button>
          </form>

          <div className="mt-6 text-center sm:text-sm">
            Remembered your password?{" "}
            <Link href="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}
