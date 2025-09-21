import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { profiles } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json({ 
        error: "Valid userId is required",
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }

    const profile = await db.select({
      id: profiles.id,
      userId: profiles.userId,
      targetRole: profiles.targetRole,
      yearsExperience: profiles.yearsExperience,
      resumeText: profiles.resumeText,
      updatedAt: profiles.updatedAt
    })
    .from(profiles)
    .where(eq(profiles.userId, parseInt(userId)))
    .limit(1);

    if (profile.length === 0) {
      return NextResponse.json(null);
    }

    return NextResponse.json(profile[0]);
  } catch (error) {
    console.error('GET profile error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, targetRole, yearsExperience, resumeText } = body;

    if (!userId || isNaN(parseInt(userId))) {
      return NextResponse.json({ 
        error: "Valid userId is required",
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }

    const now = Date.now();
    
    // Check if profile exists
    const existingProfile = await db.select()
      .from(profiles)
      .where(eq(profiles.userId, parseInt(userId)))
      .limit(1);

    let result;
    
    if (existingProfile.length > 0) {
      // Update existing profile
      const updated = await db.update(profiles)
        .set({
          targetRole,
          yearsExperience,
          resumeText,
          updatedAt: now
        })
        .where(eq(profiles.userId, parseInt(userId)))
        .returning();
      
      result = updated[0];
    } else {
      // Create new profile
      const created = await db.insert(profiles)
        .values({
          userId: parseInt(userId),
          targetRole,
          yearsExperience,
          resumeText,
          updatedAt: now
        })
        .returning();
      
      result = created[0];
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('PUT profile error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}