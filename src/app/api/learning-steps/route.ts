import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { learningSteps } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const pathId = searchParams.get('pathId');

    if (!pathId || isNaN(parseInt(pathId))) {
      return NextResponse.json({ 
        error: "Valid pathId is required",
        code: "INVALID_PATH_ID" 
      }, { status: 400 });
    }

    const steps = await db.select({
      id: learningSteps.id,
      pathId: learningSteps.pathId,
      title: learningSteps.title,
      url: learningSteps.url,
      completed: learningSteps.completed,
      orderIndex: learningSteps.orderIndex
    })
    .from(learningSteps)
    .where(eq(learningSteps.pathId, parseInt(pathId)))
    .orderBy(asc(learningSteps.orderIndex));

    return NextResponse.json(steps);
  } catch (error) {
    console.error('GET learning steps error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}