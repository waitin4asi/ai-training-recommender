"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { marketTrendsTop, type JobMarketTrend } from "@/lib/mockEngine"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"

export default function AnalyticsPage() {
  const [trends, setTrends] = useState<JobMarketTrend[]>([])

  useEffect(() => {
    setTrends(marketTrendsTop(6))
  }, [])

  const progressData = [
    { week: "W1", progress: 10 },
    { week: "W2", progress: 22 },
    { week: "W3", progress: 35 },
    { week: "W4", progress: 48 },
    { week: "W5", progress: 58 },
    { week: "W6", progress: 70 },
  ]

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <nav className="flex items-center gap-3 text-sm">
          <Link href="/dashboard" className="hover:underline">Dashboard</Link>
          <Link href="/recommendations" className="hover:underline">Recommendations</Link>
          <Button variant="outline" asChild><Link href="/">Home</Link></Button>
        </nav>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Market trends</CardTitle>
            <CardDescription>Top in-demand skills</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                demand: { label: "Demand", color: "hsl(221 83% 53%)" },
              }}
              className="aspect-[16/9]"
            >
              <BarChart data={trends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="skill" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
                <Bar dataKey="demandIndex" fill="var(--color-demand)" radius={4} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Learning progress</CardTitle>
            <CardDescription>Weekly completion %</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                progress: { label: "Progress", color: "hsl(142 71% 45%)" },
              }}
              className="aspect-[16/9]"
            >
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} domain={[0, 100]} />
                <Line type="monotone" dataKey="progress" stroke="var(--color-progress)" strokeWidth={2} dot={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}