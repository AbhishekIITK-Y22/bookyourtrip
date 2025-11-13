"use client";
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, UserPlus, Ticket, Bus } from "lucide-react";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("CUSTOMER");
  const [companyName, setCompanyName] = useState("");
  const [otp, setOtp] = useState("");
  const [step, setStep] = useState<"form" | "otp">("form");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:3001";
      if (step === "form") {
        const body: any = { email, password, role };
        if (role === "PROVIDER" && companyName) {
          body.companyName = companyName;
        }
        const res = await fetch(`${base}/auth/signup/initiate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        const data = await res.json();
        if (!res.ok) {
          let errorMsg = "Signup failed";
          if (typeof data?.error === 'string') {
            errorMsg = data.error;
          } else if (data?.error?.formErrors?.length > 0) {
            errorMsg = data.error.formErrors.join(', ');
          } else if (data?.error?.fieldErrors) {
            const fieldErrors = Object.entries(data.error.fieldErrors)
              .map(([field, errors]: [string, any]) => `${field}: ${errors.join(', ')}`)
              .join('; ');
            errorMsg = fieldErrors || "Validation failed";
          }
          throw new Error(errorMsg);
        }
        setInfo("Verification code sent to your email. Enter it below.");
        setStep("otp");
      } else {
        const res = await fetch(`${base}/auth/signup/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp }),
        });
        const data = await res.json();
        if (!res.ok) {
          const msg = typeof data?.error === 'string'
            ? data.error
            : data?.error?.formErrors?.join(', ') || "Invalid or expired code";
          throw new Error(msg);
        }
        localStorage.setItem("token", data.token);
        window.location.href = "/";
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unexpected error";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center py-12">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {step === "form" ? "Create your account" : "Verify your email"}
            </CardTitle>
            <CardDescription>
              {step === "form" ? "Join as a customer or provider" : "Enter the 6-digit code sent to your email"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              {step === "form" ? (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Password (min 8 characters)"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={8}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="role">Account Type</Label>
                    <select
                      id="role"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="CUSTOMER">🎫 Customer (Book tickets)</option>
                      <option value="PROVIDER">🚌 Provider (Offer transport)</option>
                    </select>
                  </div>

                  {role === "PROVIDER" && (
                    <div className="space-y-2 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <Label htmlFor="company" className="text-primary font-semibold">
                        Company Name <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="company"
                        type="text"
                        placeholder="e.g., Express Bus Co."
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        required
                      />
                      <p className="text-xs text-primary/70">
                        This will be the name of your transportation company visible to customers.
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="otp">Enter 6-digit code</Label>
                    <Input
                      id="otp"
                      inputMode="numeric"
                      pattern="\d{6}"
                      placeholder="123456"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                      required
                    />
                  </div>
                  {info && !error && (
                    <Alert>
                      <AlertDescription>{info}</AlertDescription>
                    </Alert>
                  )}
                </>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {step === "form" ? "Sending code..." : "Verifying..."}
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    {step === "form" ? "Create account" : "Verify and create account"}
                  </>
                )}
              </Button>

              {step === "otp" && (
                <div className="text-center text-sm">
                  <button
                    type="button"
                    className="text-primary hover:underline"
                    onClick={() => {
                      // Resend code by re-invoking initiate
                      setStep("form");
                      setTimeout(() => {
                        const fakeEvent = { preventDefault: () => {} } as any;
                        onSubmit(fakeEvent);
                      }, 0);
                    }}
                    disabled={loading}
                  >
                    Resend code
                  </button>
                </div>
              )}
            </form>
            
            <div className="mt-4 text-center text-sm">
              <span className="text-muted-foreground">Already have an account? </span>
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}


