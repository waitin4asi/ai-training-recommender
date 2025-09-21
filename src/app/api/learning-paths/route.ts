import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { learningPaths, learningSteps } from '@/db/schema';
import { eq, and, desc } from 'drizzle-orm';

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

    const paths = await db
      .select({
        id: learningPaths.id,
        userId: learningPaths.userId,
        title: learningPaths.title,
        createdAt: learningPaths.createdAt,
        stepCount: db.$count(learningSteps, eq(learningSteps.pathId, learningPaths.id))
      })
      .from(learningPaths)
      .where(eq(learningPaths.userId, parseInt(userId)))
      .orderBy(desc(learningPaths.createdAt));

    return NextResponse.json(paths);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, title, steps } = body;

    if (!userId || typeof userId !== 'number') {
      return NextResponse.json({ 
        error: "Valid userId is required",
        code: "INVALID_USER_ID" 
      }, { status: 400 });
    }

    if (!title || typeof title !== 'string' || title.trim().length === 0) {
      return NextResponse.json({ 
        error: "Title is required and must be a non-empty string",
        code: "INVALID_TITLE" 
      }, { status: 400 });
    }

    if (steps && !Array.isArray(steps)) {
      return NextResponse.json({ 
        error: "Steps must be an array",
        code: "INVALID_STEPS" 
      }, { status: 400 });
    }

    return await db.transaction(async (tx) => {
      const [path] = await tx
        .insert(learningPaths)
        .values({
          userId,
          title: title.trim(),
          createdAt: Date.now()
        })
        .returning();

      let createdSteps = [];
      if (steps && steps.length > 0) {
        const stepValues = steps.map((step, index) => ({
          pathId: path.id,
          title: step.title.trim(),
          url: step.url ? step.url.trim() : undefined,
          completed: false,
          orderIndex: index
        }));

        createdSteps = await tx
          .insert(learningSteps)
          .values(stepValues)
          .returning();
      }

      return NextResponse.json({
        id: path.id,
        userId: path.userId,
        title: path.title,
        createdAt: path.createdAt,
        steps: createdSteps.map(step => ({
          id: step.id,
          pathId: step.pathId,
          title: step.title,
          url: step.url,
          completed: step.completed,
          orderIndex: step.orderIndex
        }))
      }, { status: 201 });
    });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}