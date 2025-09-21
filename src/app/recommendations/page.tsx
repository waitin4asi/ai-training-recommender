"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import {
  buildLearningPath,
  buildUserProfile,
  generateRecommendations,
  toggleStepCompletion,
  type LearningPath,
  type Recommendation,
  type UserProfile,
} from "@/lib/mockEngine"

export default function RecommendationsPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [targetRole, setTargetRole] = useState<string>("Frontend Engineer")
  const [recs, setRecs] = useState<Recommendation[]>([])
  const [path, setPath] = useState<LearningPath | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem("mockProfile")
    if (stored) {
      const p = JSON.parse(stored) as UserProfile
      setProfile(p)
      setTargetRole(p.role)
    } else {
      const raw = localStorage.getItem("mockUser")
      const base = raw ? JSON.parse(raw) : { email: "alex@example.com", name: "Alex" }
      const p = buildUserProfile(base)
      setProfile(p)
      setTargetRole(p.role)
    }
  }, [])

  useEffect(() => {
    if (!profile) return
    const list = generateRecommendations(profile, targetRole)
    setRecs(list)
    const lp = buildLearningPath(profile, targetRole)
    setPath(lp)
  }, [profile, targetRole])

  function toggleStep(id: string) {
    if (!path) return
    const next = toggleStepCompletion(path, id)
    setPath(next)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Recommendations</h1>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/analytics" className="hover:underline">Analytics</Link>
          <Button variant="outline" asChild><Link href="/">Home</Link></Button>
        </nav>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skill gap analysis</CardTitle>
          <CardDescription>Target role: {targetRole}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {recs.length === 0 && <p className="text-sm text-muted-foreground">No gaps found. Try changing your target role in the Dashboard.</p>}
          <div className="grid md:grid-cols-2 gap-4">
            {recs.map((r) => (
              <div key={r.skill} className="rounded-xl border p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{r.skill}</div>
                    <div className="text-xs text-muted-foreground">Gap: {r.gap} level(s)</div>
                  </div>
                </div>
                <Progress value={Math.min(100, (1 - r.gap / r.suggestedLevel) * 100)} />
                <div className="space-y-2">
                  <div className="text-sm font-medium">Suggested courses</div>
                  <ul className="list-disc pl-4 space-y-1 text-sm">
                    {r.courses.map((c) => (
                      <li key={c.id}>
                        <a className="underline" href={c.url} target="_blank" rel="noreferrer">{c.title}</a>
                        <span className="text-muted-foreground"> • {c.provider} • {c.hours}h</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Adaptive learning path</CardTitle>
          <CardDescription>Mark steps complete to update your progress</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {path?.steps.map((s) => (
              <label key={s.id} className="flex gap-3 items-start rounded-lg border p-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={s.completed}
                  onChange={() => toggleStep(s.id)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium">{s.title}</div>
                  <div className="text-xs text-muted-foreground">{s.skill} • {s.hours}h</div>
                </div>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}