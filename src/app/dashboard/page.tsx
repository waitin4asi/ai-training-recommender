"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { buildUserProfile, parseResume, type SkillLevel, type UserProfile } from "@/lib/mockEngine"

export default function DashboardPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [role, setRole] = useState("Frontend Engineer")
  const [resumeText, setResumeText] = useState("")
  const [newSkill, setNewSkill] = useState("")
  const [newLevel, setNewLevel] = useState<SkillLevel>(2)

  useEffect(() => {
    const raw = localStorage.getItem("mockUser")
    if (!raw) return
    const base = JSON.parse(raw)
    const p = buildUserProfile({ name: base.name, email: base.email })
    setProfile(p)
    setRole(p.role)
  }, [])

  function saveProfile(next: UserProfile) {
    setProfile(next)
    localStorage.setItem("mockProfile", JSON.stringify(next))
  }

  async function handleResumeUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const text = await file.text()
    setResumeText(text)
    const parsed = parseResume(text)
    setRole(parsed.role || role)
    setProfile((prev) => prev ? { ...prev, ...parsed, skills: { ...(prev?.skills || {}), ...(parsed.skills || {}) } } as UserProfile : buildUserProfile(parsed))
  }

  function addSkill() {
    if (!newSkill) return
    setProfile((prev) => {
      const next = prev ? { ...prev, skills: { ...prev.skills, [newSkill]: newLevel } } : buildUserProfile({ skills: { [newSkill]: newLevel } })
      saveProfile(next)
      return next
    })
    setNewSkill("")
  }

  const levelOptions: { label: string; value: SkillLevel }[] = [
    { label: "1 - Novice", value: 1 },
    { label: "2 - Beginner", value: 2 },
    { label: "3 - Intermediate", value: 3 },
    { label: "4 - Advanced", value: 4 },
    { label: "5 - Expert", value: 5 },
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/recommendations" className="hover:underline">Recommendations</Link>
          <Link href="/analytics" className="hover:underline">Analytics</Link>
          <Button variant="outline" asChild><Link href="/">Home</Link></Button>
        </nav>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Basic info used to tailor recommendations</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={profile?.name || ""} onChange={(e) => setProfile((p) => p ? { ...p, name: e.target.value } : null)} placeholder="Your name" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={profile?.email || ""} onChange={(e) => setProfile((p) => p ? { ...p, email: e.target.value } : null)} placeholder="you@example.com" />
            </div>
            <div className="grid gap-2">
              <Label>Target Role</Label>
              <Select value={role} onValueChange={(v) => setRole(v)}>
                <SelectTrigger className="w-full"><SelectValue placeholder="Select role" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Frontend Engineer">Frontend Engineer</SelectItem>
                  <SelectItem value="Full Stack Engineer">Full Stack Engineer</SelectItem>
                  <SelectItem value="Data Scientist">Data Scientist</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="exp">Years of experience</Label>
              <Input id="exp" type="number" min={0} value={profile?.experienceYears ?? 0} onChange={(e) => setProfile((p) => p ? { ...p, experienceYears: Number(e.target.value) } : null)} />
            </div>
            <div className="flex gap-3">
              <Button onClick={() => profile && saveProfile({ ...profile, role })}>Save Profile</Button>
              <Button variant="outline" asChild><Link href="/recommendations">Generate Recommendations</Link></Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Resume Upload</CardTitle>
            <CardDescription>We will parse skills and experience (mock)</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Input type="file" accept=".txt,.md,.pdf,.doc,.docx" onChange={handleResumeUpload} />
            <div className="grid gap-2">
              <Label>Or paste text</Label>
              <Textarea rows={6} value={resumeText} onChange={(e) => setResumeText(e.target.value)} placeholder="Paste resume content here..." />
              <div>
                <Button size="sm" variant="outline" onClick={() => {
                  const parsed = parseResume(resumeText)
                  setRole(parsed.role || role)
                  setProfile((prev) => prev ? { ...prev, ...parsed, skills: { ...(prev?.skills || {}), ...(parsed.skills || {}) } } as UserProfile : buildUserProfile(parsed))
                }}>Parse</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>Add or edit your skills</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3 items-end">
            <div className="grid gap-2">
              <Label htmlFor="skill">Skill</Label>
              <Input id="skill" placeholder="e.g., React" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} />
            </div>
            <div className="grid gap-2">
              <Label>Level</Label>
              <Select value={String(newLevel)} onValueChange={(v) => setNewLevel(Number(v) as SkillLevel)}>
                <SelectTrigger className="w-[200px]"><SelectValue placeholder="Select level" /></SelectTrigger>
                <SelectContent>
                  {levelOptions.map((opt) => (
                    <SelectItem key={opt.value} value={`level-${opt.value}`.replace("level-", String(opt.value))}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button onClick={addSkill}>Add</Button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {Object.entries(profile?.skills || {}).map(([skill, level]) => (
              <div key={skill} className="flex items-center justify-between rounded-md border px-3 py-2">
                <span className="font-medium">{skill}</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">Level {level}</span>
                  <Button size="sm" variant="outline" onClick={() => setProfile((p) => p ? { ...p, skills: Object.fromEntries(Object.entries(p.skills).filter(([s]) => s !== skill)) } as UserProfile : p)}>Remove</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}