"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function Home() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    const user = typeof window !== "undefined" ? localStorage.getItem("mockUser") : null
    if (user) {
      // already signed in; keep on homepage but could redirect
    }
  }, [])

  function onSignIn(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    localStorage.setItem(
      "mockUser",
      JSON.stringify({ email, name: email.split("@")[0], id: "u1" })
    )
    router.push("/dashboard")
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-xl">SkillPilot</Link>
          <nav className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm hover:underline">Dashboard</Link>
            <Link href="/recommendations" className="text-sm hover:underline">Recommendations</Link>
            <Link href="/analytics" className="text-sm hover:underline">Analytics</Link>
            <Button asChild size="sm"><Link href="/dashboard">Open App</Link></Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10">
            <img
              src="https://images.unsplash.com/photo-1529101091764-c3526daf38fe?q=80&w=2069&auto=format&fit=crop"
              alt="Hero background"
              className="w-full h-full object-cover opacity-20"
            />
          </div>
          <div className="max-w-7xl mx-auto px-6 py-20 grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">AI-powered training and upskilling recommendations</h1>
              <p className="text-muted-foreground text-lg">Assess your skills, discover gaps, and follow adaptive learning paths tailored to your target role.</p>
              <div className="flex gap-3">
                <Button asChild><Link href="/recommendations">See Recommendations</Link></Button>
                <Button variant="outline" asChild><Link href="/analytics">View Analytics</Link></Button>
              </div>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Sign in</CardTitle>
                <CardDescription>Use mock auth to get into the dashboard.</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={onSignIn} className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required />
                  </div>
                  <Button type="submit" className="w-full">Continue</Button>
                  <p className="text-xs text-muted-foreground">No backend yet. Your session is stored locally.</p>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>

        <section className="border-t">
          <div className="max-w-7xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Resume parsing</CardTitle>
                <CardDescription>Extract skills with a click.</CardDescription>
              </CardHeader>
              <CardContent>
                Upload a resume on the dashboard to auto-detect skills and experience.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Skill gap analysis</CardTitle>
                <CardDescription>Know what to learn next.</CardDescription>
              </CardHeader>
              <CardContent>
                We compare your profile to target roles to highlight the highest-impact gaps.
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Adaptive paths</CardTitle>
                <CardDescription>Stay on track.</CardDescription>
              </CardHeader>
              <CardContent>
                A dynamic learning path updates as you complete courses.
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="border-t">
        <div className="max-w-7xl mx-auto px-6 py-8 text-sm text-muted-foreground flex items-center justify-between">
          <span>© {new Date().getFullYear()} SkillPilot</span>
          <span>Built with Next.js 15 + shadcn/ui</span>
        </div>
      </footer>
    </div>
  )
}