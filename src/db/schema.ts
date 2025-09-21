import { sqliteTable, integer, text, unique } from 'drizzle-orm/sqlite-core';

// Users table
export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  createdAt: integer('created_at').notNull(),
});

// User profiles table
export const profiles = sqliteTable('user_profiles', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  targetRole: text('target_role'),
  yearsExperience: integer('years_experience'),
  resumeText: text('resume_text'),
  updatedAt: integer('updated_at').notNull(),
});

// Canonical skills table
export const skills = sqliteTable('skills', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull().unique(),
});

// User skill levels junction table with unique constraint
export const userSkills = sqliteTable('user_skills', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  skillId: integer('skill_id').references(() => skills.id).notNull(),
  level: integer('level').notNull(), // 1-5
}, (table) => ({
  uniqueUserSkill: unique().on(table.userId, table.skillId)
}));

// Learning paths table
export const learningPaths = sqliteTable('learning_paths', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id).notNull(),
  title: text('title').notNull(),
  createdAt: integer('created_at').notNull(),
});

// Learning steps table
export const learningSteps = sqliteTable('learning_steps', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  pathId: integer('path_id').references(() => learningPaths.id).notNull(),
  title: text('title').notNull(),
  url: text('url'),
  completed: integer('completed', { mode: 'boolean' }).default(false),
  orderIndex: integer('order_index').notNull(),
});