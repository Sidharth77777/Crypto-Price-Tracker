"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { api } from "@/app/lib/axios";
import toast from "react-hot-toast";
import SmallSpinner from "@/app/components/SmallSpinner";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useWeb } from "@/app/context/ContextProvider";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router: AppRouterInstance = useRouter();
  const { isLogged, setIsLogged , setUserEmail} = useWeb();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const signIn = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/auth/login", { email, password });
      const data = res.data;

      localStorage.setItem("token", data.token);
      localStorage.setItem("email", email);
      toast.success("Login success");
      
      setUserEmail(email);
      setIsLogged(!isLogged);
      setEmail("");
      setPassword("");

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
          <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Sign in to continue to{" "}
            <span className="font-medium text-primary">WATCH MY CRYPTO</span>.
          </p>
        </div>

        <div className="px-6 pb-6">
          <form onSubmit={signIn} method="post" className="space-y-4">
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

            {/* Password */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <Link
                  href="/forgotPassword"
                  className="text-sm text-primary hover:underline"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-3 flex items-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <Button
              disabled={!email || !password}
              type="submit"
              className="w-full bg-primary cursor-pointer text-primary-foreground hover:bg-primary/90"
            >
              {loading ? <SmallSpinner /> : "Sign In"}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            No account?{" "}
            <Link
              href="/signUp"
              className="font-medium cursor-pointer text-primary hover:underline"
            >
              Sign up now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
