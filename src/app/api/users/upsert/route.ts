import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name } = body;

    // Validate email is provided
    if (!email) {
      return NextResponse.json({ 
        error: "Email is required",
        code: "MISSING_EMAIL"
      }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ 
        error: "Invalid email format",
        code: "INVALID_EMAIL"
      }, { status: 400 });
    }

    // Normalize email to lowercase
    const normalizedEmail = email.toLowerCase().trim();

    // Set name default to email if not provided or empty
    const userName = name && name.trim() ? name.trim() : normalizedEmail;
    const now = Date.now();

    // Check if user exists by email
    const existingUser = await db.select({
      id: users.id,
      email: users.email,
      name: users.name,
      createdAt: users.createdAt
    })
    .from(users)
    .where(eq(users.email, normalizedEmail))
    .limit(1);

    let result;

    if (existingUser.length > 0) {
      // Update existing user - only update name if provided and different
      const currentUser = existingUser[0];
      const updateNeeded = name && name.trim() && name.trim() !== currentUser.name;

      if (updateNeeded) {
        const updated = await db.update(users)
          .set({ 
            name: userName,
            updatedAt: Date.now()
          })
          .where(eq(users.email, normalizedEmail))
          .returning({
            id: users.id,
            email: users.email,
            name: users.name,
            createdAt: users.createdAt
          });
        
        result = updated[0];
      } else {
        // No update needed, return existing user
        result = currentUser;
      }
    } else {
      // Insert new user
      const newUser = await db.insert(users)
        .values({
          email: normalizedEmail,
          name: userName,
          createdAt: now,
          updatedAt: now
        })
        .returning({
          id: users.id,
          email: users.email,
          name: users.name,
          createdAt: users.createdAt
        });
      
      result = newUser[0];
    }

    // Convert integer timestamp to ISO string for consistency with other endpoints
    const responseUser = {
      id: result.id,
      email: result.email,
      name: result.name,
      createdAt: new Date(result.createdAt).toISOString()
    };

    return NextResponse.json(responseUser, { status: existingUser.length > 0 ? 200 : 201 });

  } catch (error) {
    console.error('User upsert error:', error);
    
    // Handle unique constraint violations
    if (error instanceof Error && error.message.includes('UNIQUE constraint failed')) {
      return NextResponse.json({ 
        error: 'Email already exists',
        code: 'DUPLICATE_EMAIL'
      }, { status: 400 });
    }

    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}