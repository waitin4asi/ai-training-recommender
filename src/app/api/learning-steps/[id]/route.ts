import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { learningSteps } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function PATCH(
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

    const body = await request.json();
    const { completed, title, url, orderIndex } = body;
    
    // Build update object with only provided fields
    const updates: any = {};
    
    if (completed !== undefined) {
      updates.completed = completed;
    }
    
    if (title !== undefined) {
      if (typeof title !== 'string' || title.trim().length === 0) {
        return NextResponse.json({ 
          error: 'Title must be a non-empty string',
          code: 'INVALID_TITLE'
        }, { status: 400 });
      }
      updates.title = title.trim();
    }
    
    if (url !== undefined) {
      updates.url = url;
    }
    
    if (orderIndex !== undefined) {
      if (typeof orderIndex !== 'number' || orderIndex < 0) {
        return NextResponse.json({ 
          error: 'Order index must be a positive number',
          code: 'INVALID_ORDER_INDEX'
        }, { status: 400 });
      }
      updates.orderIndex = orderIndex;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ 
        error: 'No valid fields provided for update',
        code: 'NO_UPDATES'
      }, { status: 400 });
    }

    // Check if step exists
    const existingStep = await db.select()
      .from(learningSteps)
      .where(eq(learningSteps.id, parseInt(id)))
      .limit(1);

    if (existingStep.length === 0) {
      return NextResponse.json({ 
        error: 'Learning step not found',
        code: 'STEP_NOT_FOUND'
      }, { status: 404 });
    }

    // Update the step
    const updated = await db.update(learningSteps)
      .set(updates)
      .where(eq(learningSteps.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('PATCH learning step error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}