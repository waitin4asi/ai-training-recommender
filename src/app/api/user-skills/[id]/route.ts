import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { userSkills } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID'
      }, { status: 400 });
    }

    // Check if user skill exists
    const existingSkill = await db.select()
      .from(userSkills)
      .where(eq(userSkills.id, parseInt(id)))
      .limit(1);

    if (existingSkill.length === 0) {
      return NextResponse.json({ 
        error: 'User skill not found',
        code: 'USER_SKILL_NOT_FOUND'
      }, { status: 404 });
    }

    // Delete the user skill
    await db.delete(userSkills)
      .where(eq(userSkills.id, parseInt(id)));

    return NextResponse.json({ 
      success: true, 
      message: "User skill deleted" 
    });
  } catch (error) {
    console.error('DELETE user skill error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}