"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { authClient, useSession } from "@/lib/auth-client"

export default function LoginPage() {
  const router = useRouter()
  const search = useSearchParams()
  const { data: session, isPending } = useSession()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [rememberMe, setRememberMe] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const registered = search.get("registered") === "true"

  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace("/dashboard")
    }
  }, [session, isPending, router])

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
        rememberMe,
        callbackURL: "/dashboard",
      })
      if (error?.code) {
        setError("Invalid email or password. Please make sure you have already registered an account and try again.")
        return
      }
      router.push("/dashboard")
    } catch (err: any) {
      setError("Login failed. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Log in</CardTitle>
          <CardDescription>
            {registered ? "Account created! Please log in." : "Access your SkillPilot dashboard."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" autoComplete="off" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <div className="flex items-center gap-2">
              <Checkbox id="remember" checked={rememberMe} onCheckedChange={(v) => setRememberMe(Boolean(v))} />
              <Label htmlFor="remember" className="text-sm text-muted-foreground">Remember me</Label>
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? "Signing in..." : "Sign in"}
            </Button>
            <p className="text-sm text-muted-foreground text-center">
              Don't have an account? <Link href="/register" className="underline">Register</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}