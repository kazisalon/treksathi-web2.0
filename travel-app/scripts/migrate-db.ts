import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database migration...');
  
  try {
    // This will apply the schema changes
    await prisma.$executeRaw`PRAGMA foreign_keys=off;`;
    
    // Add new columns to User table
    await prisma.$executeRaw`ALTER TABLE User ADD COLUMN username TEXT;`;
    await prisma.$executeRaw`ALTER TABLE User ADD COLUMN phoneNumber TEXT;`;
    await prisma.$executeRaw`ALTER TABLE User ADD COLUMN gender TEXT;`;
    await prisma.$executeRaw`ALTER TABLE User ADD COLUMN alias TEXT;`;
    
    // Create unique index for username
    await prisma.$executeRaw`CREATE UNIQUE INDEX User_username_key ON User(username);`;
    
    await prisma.$executeRaw`PRAGMA foreign_keys=on;`;
    
    console.log('Database migration completed successfully!');
  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();