import { PrismaClient } from '@prisma/client';
import { spamReportSchema } from '../validators/authValidator.js';

const prisma = new PrismaClient();

// Function to mark a number as spam
export const markSpam = async (req, res) => {
  try {
    const parsed = spamReportSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ errors: parsed.error.errors });
    }

    const { phoneNumber } = parsed.data;
    const userId = req.user.id;

    // Check if already reported
    const existing = await prisma.spamReport.findUnique({
      where: {
        phoneNumber_reportedById: {
          phoneNumber,
          reportedById: userId,
        },
      },
    });

    if (existing) {
      return res.status(409).json({ message: 'You already marked this number as spam' });
    }

    await prisma.spamReport.create({
      data: {
        phoneNumber,
        reportedById: userId,
      },
    });

    res.status(201).json({ message: 'Number marked as spam successfully!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
