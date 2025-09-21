import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userSkills, skills } from '@/db/schema';
import { eq, and } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const userIdParam = searchParams.get('userId');
    
    if (!userIdParam || isNaN(parseInt(userIdParam))) {
      return NextResponse.json({ 
        error: "Valid userId is required",
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }
    
    const userId = parseInt(userIdParam);
    
    const userSkillResults = await db
      .select({
        id: userSkills.id,
        skillId: userSkills.skillId,
        level: userSkills.level,
        skillName: skills.name
      })
      .from(userSkills)
      .innerJoin(skills, eq(userSkills.skillId, skills.id))
      .where(eq(userSkills.userId, userId))
      .orderBy(skills.name);
    
    return NextResponse.json(userSkillResults);
    
  } catch (error) {
    console.error('GET userSkills error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const requestBody = await request.json();
    const { userId, skillId, level } = requestBody;
    
    // Validate fields
    if (userId === undefined || skillId === undefined || level === undefined) {
      return NextResponse.json({ 
        error: "userId, skillId, and level are required",
        code: "MISSING_REQUIRED_FIELDS" 
      }, { status: 400 });
    }
    
    if (isNaN(parseInt(String(userId)))) {
      return NextResponse.json({ 
        error: "userId must be a valid number",
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }
    
    if (isNaN(parseInt(String(skillId)))) {
      return NextResponse.json({ 
        error: "skillId must be a valid number",
        code: "INVALID_SKILL_ID" 
      }, { status: 400 });
    }
    
    if (isNaN(parseInt(String(level))) || parseInt(String(level)) < 1 || parseInt(String(level)) > 5) {
      return NextResponse.json({ 
        error: "level must be a number between 1 and 5",
        code: "INVALID_LEVEL" 
      }, { status: 400 });
    }
    
    const validUserId = parseInt(String(userId));
    const validSkillId = parseInt(String(skillId));
    const validLevel = parseInt(String(level));
    
    // Check if the skill exists
    const skillExists = await db.select().from(skills).where(eq(skills.id, validSkillId)).limit(1);
    if (skillExists.length === 0) {
      return NextResponse.json({ 
        error: "Skill not found",
        code: "SKILL_NOT_FOUND" 
      }, { status: 404 });
    }
    
    // Check if user skill already exists
    const existingUserSkill = await db.select()
      .from(userSkills)
      .where(and(
        eq(userSkills.userId, validUserId),
        eq(userSkills.skillId, validSkillId)
      ))
      .limit(1);
    
    let result;
    
    if (existingUserSkill.length > 0) {
      // Update existing user skill
      const updated = await db.update(userSkills)
        .set({ level: validLevel })
        .where(and(
          eq(userSkills.userId, validUserId),
          eq(userSkills.skillId, validSkillId)
        ))
        .returning();
      
      result = updated[0];
    } else {
      // Insert new user skill
      const inserted = await db.insert(userSkills)
        .values({
          userId: validUserId,
          skillId: validSkillId,
          level: validLevel
        })
        .returning();
      
      result = inserted[0];
    }
    
    return NextResponse.json(result, { status: existingUserSkill.length > 0 ? 200 : 201 });
    
  } catch (error) {
    console.error('POST userSkills error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}