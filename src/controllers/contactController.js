import { PrismaClient } from '@prisma/client';
import { importContactsSchema } from '../validators/authValidator.js';

const prisma = new PrismaClient();

// Function to import contacts
// This function takes an array of contacts from the request body and saves them to the database.

export const importContacts = async (req, res) => {
  try {
    const parsed = importContactsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const contacts = parsed.data;
    const userId = req.user.id;

    const createManyPayload = contacts.map(contact => ({
      name: contact.name.toLowerCase(), 
      phoneNumber: contact.phoneNumber,
      ownerId: userId
    }));

    await prisma.contact.createMany({
      data: createManyPayload,
      skipDuplicates: true, //skip if same contact already added
    });

    res.status(201).json({ message: 'Contacts imported successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
