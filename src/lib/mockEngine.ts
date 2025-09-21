// Mock AI-powered training & upskilling recommendation engine
// This file simulates resume parsing, skill extraction, gap analysis,
// course recommendations, and dynamic learning paths using static data.

export type SkillLevel = 1 | 2 | 3 | 4 | 5

export type UserProfile = {
  id: string
  name: string
  email: string
  role: string
  experienceYears: number
  skills: Record<string, SkillLevel>
}

export type JobMarketTrend = {
  skill: string
  demandIndex: number // 0-100
  growthYoY: number // -1.0 to 1.0
}

export type Course = {
  id: string
  title: string
  provider: string
  url: string
  skill: string
  difficulty: "beginner" | "intermediate" | "advanced"
  hours: number
}

export type Recommendation = {
  skill: string
  gap: number // desired - current
  suggestedLevel: SkillLevel
  courses: Course[]
}

export type LearningPathStep = {
  id: string
  skill: string
  courseId: string
  title: string
  hours: number
  completed: boolean
}

export type LearningPath = {
  userId: string
  targetRole: string
  steps: LearningPathStep[]
}

// --- Sample Data ---

export const MARKET_TRENDS: JobMarketTrend[] = [
  { skill: "React", demandIndex: 88, growthYoY: 0.12 },
  { skill: "TypeScript", demandIndex: 84, growthYoY: 0.15 },
  { skill: "Node.js", demandIndex: 81, growthYoY: 0.09 },
  { skill: "Python", demandIndex: 90, growthYoY: 0.11 },
  { skill: "SQL", demandIndex: 78, growthYoY: 0.06 },
  { skill: "Machine Learning", demandIndex: 86, growthYoY: 0.17 },
  { skill: "Docker", demandIndex: 75, growthYoY: 0.08 },
]

export const COURSES: Course[] = [
  { id: "c1", title: "React Fundamentals", provider: "Meta", url: "https://www.coursera.org/learn/react-basics", skill: "React", difficulty: "beginner", hours: 12 },
  { id: "c2", title: "Advanced React Patterns", provider: "Frontend Masters", url: "https://frontendmasters.com", skill: "React", difficulty: "advanced", hours: 8 },
  { id: "c3", title: "TypeScript for Professionals", provider: "Udemy", url: "https://www.udemy.com", skill: "TypeScript", difficulty: "intermediate", hours: 10 },
  { id: "c4", title: "Node.js: The Complete Guide", provider: "Udemy", url: "https://www.udemy.com", skill: "Node.js", difficulty: "intermediate", hours: 20 },
  { id: "c5", title: "Practical Machine Learning", provider: "Coursera", url: "https://www.coursera.org", skill: "Machine Learning", difficulty: "beginner", hours: 15 },
  { id: "c6", title: "Docker Deep Dive", provider: "Pluralsight", url: "https://www.pluralsight.com", skill: "Docker", difficulty: "advanced", hours: 9 },
  { id: "c7", title: "SQL for Data Analysis", provider: "DataCamp", url: "https://www.datacamp.com", skill: "SQL", difficulty: "intermediate", hours: 6 },
]

// --- Mock functions ---

export function parseResume(fileText: string): Partial<UserProfile> {
  // naive keyword scan
  const skills: Record<string, SkillLevel> = {}
  const skillKeywords = ["React", "TypeScript", "Node.js", "Python", "SQL", "Machine Learning", "Docker"]
  skillKeywords.forEach((s) => {
    const regex = new RegExp(`${s}`, "i")
    if (regex.test(fileText)) {
      skills[s] = 3
    }
  })

  return {
    role: /developer|engineer/i.test(fileText) ? "Software Engineer" : "",
    experienceYears: /([0-9]+)\+?\s*(years|yrs)/i.exec(fileText)?.[1]
      ? Number(/([0-9]+)\+?\s*(years|yrs)/i.exec(fileText)![1])
      : 2,
    skills,
  }
}

export function buildUserProfile(base: Partial<UserProfile> = {}): UserProfile {
  return {
    id: base.id || "u1",
    name: base.name || "Alex Developer",
    email: base.email || "alex@example.com",
    role: base.role || "Frontend Engineer",
    experienceYears: base.experienceYears || 3,
    skills: {
      React: 3,
      TypeScript: 2,
      "Node.js": 2,
      SQL: 2,
      ...base.skills,
    },
  }
}

export function desiredSkillsForRole(role: string): Record<string, SkillLevel> {
  // very basic role mapping
  if (/full\s*stack/i.test(role)) {
    return { React: 4, TypeScript: 4, "Node.js": 4, SQL: 3, Docker: 3 }
  }
  if (/data/i.test(role)) {
    return { Python: 4, "Machine Learning": 4, SQL: 4, Docker: 2 }
  }
  return { React: 4, TypeScript: 4, "Node.js": 3, SQL: 3 }
}

export function analyzeSkillGaps(user: UserProfile, targetRole: string) {
  const desired = desiredSkillsForRole(targetRole)
  const result = Object.keys(desired).map((skill) => {
    const current = user.skills[skill] || 1
    const gap = Math.max(0, desired[skill] - current)
    const suggestedLevel = Math.max(current, desired[skill]) as SkillLevel
    return { skill, current, desired: desired[skill], gap, suggestedLevel }
  })
  return result.sort((a, b) => b.gap - a.gap)
}

export function recommendCoursesForSkill(skill: string, level: SkillLevel): Course[] {
  // prioritize by matching skill, then by difficulty closeness
  const pool = COURSES.filter((c) => c.skill === skill)
  const targetIdx = level <= 2 ? 0 : level === 3 ? 1 : 2
  const diffRank = { beginner: 0, intermediate: 1, advanced: 2 } as const
  return pool
    .slice()
    .sort((a, b) => Math.abs(diffRank[a.difficulty] - targetIdx) - Math.abs(diffRank[b.difficulty] - targetIdx))
    .slice(0, 3)
}

export function generateRecommendations(user: UserProfile, targetRole: string): Recommendation[] {
  const gaps = analyzeSkillGaps(user, targetRole)
  return gaps
    .filter((g) => g.gap > 0)
    .map((g) => ({
      skill: g.skill,
      gap: g.gap,
      suggestedLevel: g.suggestedLevel,
      courses: recommendCoursesForSkill(g.skill, g.suggestedLevel),
    }))
}

export function buildLearningPath(user: UserProfile, targetRole: string): LearningPath {
  const recs = generateRecommendations(user, targetRole)
  const steps: LearningPathStep[] = []
  recs.forEach((r, i) => {
    r.courses.forEach((c, j) => {
      steps.push({
        id: `${r.skill}-${c.id}`,
        skill: r.skill,
        courseId: c.id,
        title: c.title,
        hours: c.hours,
        completed: false,
      })
    })
  })
  return { userId: user.id, targetRole, steps }
}

export function toggleStepCompletion(path: LearningPath, stepId: string): LearningPath {
  return {
    ...path,
    steps: path.steps.map((s) => (s.id === stepId ? { ...s, completed: !s.completed } : s)),
  }
}

export function marketTrendsTop(n = 5): JobMarketTrend[] {
  return MARKET_TRENDS.slice().sort((a, b) => b.demandIndex - a.demandIndex).slice(0, n)
}