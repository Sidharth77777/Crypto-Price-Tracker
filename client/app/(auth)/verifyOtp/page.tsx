"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useWeb } from "@/app/context/ContextProvider";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import toast from "react-hot-toast";
import { api } from "@/app/lib/axios";
import SmallSpinner from "@/app/components/SmallSpinner";

export default function VerifyOtpPage() {
  const router: AppRouterInstance = useRouter();
  const { tempEmail, setTempEmail, tempOTP, setTempOTP } = useWeb();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!tempEmail) {
      router.back();
    }
  },[])

  const verifyOTP = async(e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/verify-otp", { email: tempEmail, otp: tempOTP });
      const data = res.data;

      toast.success(data.message);
      router.push("/resetPassword");

    } catch(err:any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading(false);
    }
  }

  const submitMail = async(): Promise<void> => {
    try {
      const res = await api.post("/auth/forgot-password", { email: tempEmail });
      const data = res.data;

      toast.success(data.message);

    } catch (err:any) {
      console.error(err);
      setTempEmail("");
      toast.error(err?.response?.data?.message || "Internal Server Error");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card text-card-foreground shadow-lg">
        <div className="px-6 pt-6 pb-2">
          <h1 className="text-2xl font-semibold tracking-tight">Verify OTP</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Enter the 6-digit code sent to your email.
          </p>
        </div>

        <div className="px-6 pb-6">
          <form onSubmit={verifyOTP} method="post" className="space-y-6">
            <div className="flex justify-center">
              <InputOTP 
			  	      maxLength={6}
  				      value={tempOTP}
  				      onChange={(val) => setTempOTP(val)}>
                <InputOTPGroup className="flex gap-2 sm:gap-3 md:gap-4">
                  <InputOTPSlot
                    index={0}
                    className="h-12 w-8 text-lg sm:h-14 sm:w-14 sm:text-xl md:h-14 md:w-14 md:text-2xl rounded-lg focus-visible:ring-ring"
                    aria-label="OTP digit 1"
                  />
                  <InputOTPSlot
                    index={1}
                    className="h-12 w-8 text-lg sm:h-14 sm:w-14 sm:text-xl md:h-14 md:w-14 md:text-2xl rounded-lg focus-visible:ring-ring"
                    aria-label="OTP digit 2"
                  />
                  <InputOTPSlot
                    index={2}
                    className="h-12 w-8 text-lg sm:h-14 sm:w-14 sm:text-xl md:h-14 md:w-14 md:text-2xl rounded-lg focus-visible:ring-ring"
                    aria-label="OTP digit 3"
                  />
                  <InputOTPSlot
                    index={3}
                    className="h-12 w-8 text-lg sm:h-14 sm:w-14 sm:text-xl md:h-14 md:w-14 md:text-2xl rounded-lg focus-visible:ring-ring"
                    aria-label="OTP digit 4"
                  />
                  <InputOTPSlot
                    index={4}
                    className="h-12 w-8 text-lg sm:h-14 sm:w-14 sm:text-xl md:h-14 md:w-14 md:text-2xl rounded-lg focus-visible:ring-ring"
                    aria-label="OTP digit 5"
                  />
                  <InputOTPSlot
                    index={5}
                    className="h-12 w-8 text-lg sm:h-14 sm:w-14 sm:text-xl md:h-14 md:w-14 md:text-2xl rounded-lg focus-visible:ring-ring"
                    aria-label="OTP digit 6"
                  />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              disabled={!(tempOTP.length === 6)}
              type="submit"
              className="w-full bg-primary text-primary-foreground cursor-pointer hover:bg-primary/90"
            >
              {loading ? <SmallSpinner /> : "Verify & Continue"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            Didn't receive the code?{" "}
            <button
              onClick={() => submitMail()}
              type="button"
              className="cursor-pointer font-medium text-primary hover:underline"
            >
              Resend OTP
            </button>
          </div>

          <div className="mt-2 text-center text-sm">
            <Link href="/login" className="text-primary hover:underline">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
