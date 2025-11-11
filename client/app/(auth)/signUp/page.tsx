"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useWeb } from "@/app/context/ContextProvider";
import toast from "react-hot-toast";
import { api } from "@/app/lib/axios";
import SmallSpinner from "@/app/components/SmallSpinner";
import { Eye, EyeOff } from "lucide-react";

export default function SignUpPage() {
  const router: AppRouterInstance = useRouter();
  const { isLogged, setIsLogged, setUserEmail } = useWeb();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const signUp = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords need to match");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/auth/register", { email, password });
      const data = res.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", email);
      toast.success("SignUp success");

      setIsLogged(!isLogged);
      setUserEmail(email);
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      router.push("/dashboard");
    } catch (err: any) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Internal Server Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-xl rounded-2xl border border-border bg-card text-card-foreground shadow-lg">
        <div className="px-6 pt-6 pb-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Join{" "}
            <span className="font-medium text-primary">WATCH MY CRYPTO</span> to
            track prices in real time
          </p>
        </div>

        <div className="px-6 pb-6">
          <form onSubmit={signUp} method="post" className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Create a strong password"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 cursor-pointer" />
                  ) : (
                    <Eye className="w-5 h-5 cursor-pointer" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 cursor-pointer" />
                  ) : (
                    <Eye className="w-5 h-5 cursor-pointer" />
                  )}
                </button>
              </div>
            </div>

            <Button
              disabled={!email || !password || !confirmPassword}
              type="submit"
              className="w-full cursor-pointer bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {loading ? <SmallSpinner /> : "Create Account"}
            </Button>
          </form>

          <div className="mt-6 text-center sm:text-sm">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium cursor-pointer text-primary hover:underline"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
