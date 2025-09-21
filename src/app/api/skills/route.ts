import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { skills } from '@/db/schema';
import { asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const allSkills = await db.select({
      id: skills.id,
      name: skills.name
    }).from(skills)
      .orderBy(asc(skills.name));

    return NextResponse.json(allSkills);
  } catch (error) {
    console.error('GET skills error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();
    
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json({ 
        error: "Valid skill name is required",
        code: "INVALID_NAME" 
      }, { status: 400 });
    }

    const newSkill = await db.insert(skills)
      .values({ name: name.trim() })
      .returning();

    return NextResponse.json(newSkill[0], { status: 201 });
  } catch (error) {
    console.error('POST skill error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}