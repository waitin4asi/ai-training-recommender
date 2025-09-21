"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NavBar() {
  return (
    <div className="w-full border-b">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-semibold text-xl">SkillPilot</Link>
        <nav className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm hover:underline">Dashboard</Link>
          <Link href="/recommendations" className="text-sm hover:underline">Recommendations</Link>
          <Link href="/analytics" className="text-sm hover:underline">Analytics</Link>
          <Button asChild size="sm"><Link href="/dashboard">Open App</Link></Button>
        </nav>
      </div>
    </div>
  )
}