import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Function to search for users and contacts by name or phone number
export const searchByName = async (req, res) => {
  const name = req.query.name?.toLowerCase();

  if (!name || name.trim().length === 0) {
    return res.status(400).json({ message: 'Query param `name` is required' });
  }

  try {
    // 1. Find registered users whose name starts with or contains query
    const users = await prisma.user.findMany({
      where: {
        name: {
          contains: name,
        },
      },
      select: {
        name: true,
        phoneNumber: true,
      },
    });

    // 2. Find contacts whose name matches query
    const contacts = await prisma.contact.findMany({
      where: {
        name: {
          contains: name,
        },
      },
      select: {
        name: true,
        phoneNumber: true,
      },
    });

    // Combine and deduplicate by phoneNumber
    const combined = [...users, ...contacts];
    const uniqueResults = new Map();

    for (const entry of combined) {
      const key = entry.phoneNumber;
      if (!uniqueResults.has(key)) {
        uniqueResults.set(key, { ...entry });
      }
    }

    // 3. Add spam report count for each phone number
    const result = await Promise.all(
      [...uniqueResults.values()].map(async (item) => {
        const spamCount = await prisma.spamReport.count({
          where: { phoneNumber: item.phoneNumber },
        });
        return {
          ...item,
          spamCount,
          matchStrength: item.name.toLowerCase().startsWith(name.toLowerCase()) ? 1 : 2,
        };
      })
    );

    // 4. Sort results: matchStrength = 1 first
    result.sort((a, b) => a.matchStrength - b.matchStrength);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Function to search for users and contacts by phone number
export const searchByPhone = async (req, res) => {
  const phone = req.query.phone;

  if (!phone || phone.length !== 10) {
    return res.status(400).json({ message: 'Valid phone number is required' });
  }

  try {
    // Check User table
    const user = await prisma.user.findUnique({
      where: { phoneNumber: phone },
      select: { name: true, phoneNumber: true }
    });

    // If found → return ONLY that user
    if (user) {
      const spamCount = await prisma.spamReport.count({
        where: { phoneNumber: phone }
      });

      return res.status(200).json({
        ...user,
        spamCount
      });
    }

    // Find ALL contact names with same phone number
    const contacts = await prisma.contact.findMany({
      where: { phoneNumber: phone },  
      select: {
        name: true,
        phoneNumber: true
      }
    });

    if (contacts.length === 0) {
      return res.status(404).json({ message: 'Number not found in database' });
    }

    const results = await Promise.all(
      contacts.map(async (contact) => {
        const spamCount = await prisma.spamReport.count({
          where: { phoneNumber: contact.phoneNumber }
        });

        return {
          ...contact,
          spamCount
        };
      })
    );

    res.status(200).json(results);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to get user details by phone number
export const getUserDetailsByPhone = async (req, res) => {
  const phone = req.params.phone;
  const requesterPhone = req.user.phoneNumber;

  try {
    // 1. Check if user is registered
    const user = await prisma.user.findUnique({
      where: { phoneNumber: phone },
      select: {
        id: true,
        name: true,
        phoneNumber: true,
        email: true
      }
    });

    // 2. If user doesn't exist
    if (!user) {
      return res.status(404).json({ message: 'User not found with this phone number' });
    }

    // 3. Count spam reports
    const spamCount = await prisma.spamReport.count({
      where: { phoneNumber: phone }
    });

    // 4. Check if requester is in their contact list
    const isInTheirContacts = await prisma.contact.findFirst({
      where: {
        ownerId: user.id,                     // the person you're checking
        phoneNumber: requesterPhone          // you (logged-in user)
      }
    });

    // 5. Prepare response
    const result = {
      name: user.name,
      phoneNumber: user.phoneNumber,
      spamCount
    };

    if (isInTheirContacts) {
      result.email = user.email;
    }

    return res.status(200).json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};