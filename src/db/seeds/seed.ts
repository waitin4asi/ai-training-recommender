import { db } from '../index';
import { users, profiles, skills, userSkills, learningPaths, learningSteps } from '../schema';

export async function seed() {
  try {
    console.log('🌱 Starting seeding...');

    // Insert canonical skills
    const skillsData = [
      { name: "JavaScript" },
      { name: "TypeScript" },
      { name: "React" },
      { name: "Node.js" },
      { name: "SQL" },
      { name: "Python" },
      { name: "Data Analysis" },
      { name: "Machine Learning" },
      { name: "Project Management" },
      { name: "Communication" }
    ];

    const insertedSkills = await db.insert(skills).values(skillsData).returning();
    console.log(`✅ Inserted ${insertedSkills.length} skills`);

    // Create demo user
    const now = Date.now();
    const demoUserData = {
      email: "demo@skillpilot.ai",
      name: "Demo User",
      createdAt: now
    };

    const [demoUser] = await db.insert(users).values(demoUserData).returning();
    console.log(`✅ Created demo user: ${demoUser.email}`);

    // Create demo profile
    const profileData = {
      userId: demoUser.id,
      targetRole: "Frontend Engineer",
      yearsExperience: 3,
      updatedAt: now
    };

    const [demoProfile] = await db.insert(profiles).values(profileData).returning();
    console.log(`✅ Created demo profile for user ${demoUser.id}`);

    // Create demo user skills
    const skillMap = insertedSkills.reduce((acc, skill) => {
      acc[skill.name] = skill.id;
      return acc;
    }, {} as Record<string, number>);

    const userSkillsData = [
      { userId: demoUser.id, skillId: skillMap["JavaScript"], level: 4 },
      { userId: demoUser.id, skillId: skillMap["TypeScript"], level: 3 },
      { userId: demoUser.id, skillId: skillMap["React"], level: 4 },
      { userId: demoUser.id, skillId: skillMap["Node.js"], level: 2 }
    ];

    const insertedUserSkills = await db.insert(userSkills).values(userSkillsData).returning();
    console.log(`✅ Inserted ${insertedUserSkills.length} user skills`);

    // Create demo learning path
    const learningPathData = {
      userId: demoUser.id,
      title: "Advanced React Patterns",
      createdAt: now
    };

    const [learningPath] = await db.insert(learningPaths).values(learningPathData).returning();
    console.log(`✅ Created learning path: ${learningPath.title}`);

    // Create learning steps
    const learningStepsData = [
      {
        pathId: learningPath.id,
        title: "Learn React Hooks",
        url: "https://react.dev/reference/react",
        completed: true,
        orderIndex: 0
      },
      {
        pathId: learningPath.id,
        title: "Master Context API",
        url: "https://react.dev/reference/react/useContext",
        completed: true,
        orderIndex: 1
      },
      {
        pathId: learningPath.id,
        title: "Custom Hooks",
        url: "https://react.dev/learn/reusing-logic-with-custom-hooks",
        completed: false,
        orderIndex: 2
      },
      {
        pathId: learningPath.id,
        title: "Performance Optimization",
        url: "https://react.dev/reference/react/memo",
        completed: false,
        orderIndex: 3
      }
    ];

    const insertedSteps = await db.insert(learningSteps).values(learningStepsData).returning();
    console.log(`✅ Inserted ${insertedSteps.length} learning steps`);

    console.log('🎉 Seeding completed successfully!');
    
    return {
      skills: insertedSkills.length,
      users: 1,
      profiles: 1,
      userSkills: insertedUserSkills.length,
      learningPaths: 1,
      learningSteps: insertedSteps.length
    };

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
}

// Run seeder if this file is executed directly
if (require.main === module) {
  seed()
    .then((result) => {
      console.log('Seeding result:', result);
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding error:', error);
      process.exit(1);
    });
}