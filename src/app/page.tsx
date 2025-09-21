"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col">
      <header className="w-full">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="font-semibold text-xl">SkillPilot</Link>
          <nav className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm hover:underline">Dashboard</Link>
            <Link href="/recommendations" className="text-sm hover:underline">Recommendations</Link>
            <Link href="/analytics" className="text-sm hover:underline">Analytics</Link>
            <Link href="/login" className="text-sm hover:underline">Login</Link>
            <Link href="/register" className="text-sm hover:underline">Register</Link>
            <Button asChild size="sm"><Link href="/login">Open App</Link></Button>
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
                <CardTitle>Get started</CardTitle>
                <CardDescription>Create an account or sign in to continue.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3">
                  <Button asChild className="w-full"><Link href="/login">Sign in</Link></Button>
                  <Button asChild variant="outline" className="w-full"><Link href="/register">Create account</Link></Button>
                  <p className="text-xs text-muted-foreground text-center">Secure authentication powered by better-auth.</p>
                </div>
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