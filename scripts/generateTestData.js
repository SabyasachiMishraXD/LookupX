// Script to generate mock data for testing the application.
// It creates users, their contacts, and spam reports using Prisma ORM.
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const NUM_USERS = 20;
const CONTACTS_PER_USER = 30;
const SPAM_REPORTS = 10;

const generate = async () => {
  try {
    //Clear existing records from all tables to avoid duplicates
    console.log("Clearing existing data...");
    await prisma.spamReport.deleteMany();
    await prisma.contact.deleteMany();
    await prisma.user.deleteMany();
    console.log('Generating test data...');

    // Hash a common password for all users
    //We can use a common password for all users to simplify the test data generation
    //In a real-world scenario, we would want to use unique passwords for each user
    //But for the sake of this test, we will use a common password
    //This is a simple password for demonstration purposes
    const hashedPassword = await bcrypt.hash('Test@123', 10);
    const users = [];

    // Create 20 users
    for (let i = 1; i <= NUM_USERS; i++) {
      const user = await prisma.user.create({
        data: {
          name: `user${i}`,
          phoneNumber: `90000000${String(i).padStart(2, '0')}`,
          email: `user${i}@test.com`,
          password: hashedPassword,
        },
      });
      users.push(user);
    }

    // Create 30 contacts per user
    for (const user of users) {
      for (let i = 1; i <= CONTACTS_PER_USER; i++) {
        await prisma.contact.create({
          data: {
            name: `contact${i}of${user.name.toLowerCase()}`,
            phoneNumber: `80000000${String(i).padStart(2, '0')}`,
            ownerId: user.id,
          },
        });
      }
    }

    // Create 10 random spam reports
    for (let i = 0; i < SPAM_REPORTS; i++) {
      const reporter = users[Math.floor(Math.random() * users.length)];
      const randomPhone = `80000000${String(Math.floor(Math.random() * CONTACTS_PER_USER + 1)).padStart(2, '0')}`;

      await prisma.spamReport.create({
        data: {
          phoneNumber: randomPhone,
          reportedById: reporter.id,
        },
      });
    }

    console.log(' Test data generated successfully!');
    process.exit(0);
  } catch (err) {
    console.error(' Error generating test data:', err);
    process.exit(1);
  }
};

generate();
