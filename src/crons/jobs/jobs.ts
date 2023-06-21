import { Logger } from '@nestjs/common';
import { OverDueCategory } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

export const updateLoansOverdueCategory = async (
  prisma: PrismaService,
  logger: Logger,
) => {
  try {
    const loans = await prisma.loans.findMany({
      where: {
        paid: false,
      },
    });

    loans.forEach(async (loan) => {
      const dueDate = new Date(loan.loan_due_date);
      const today = new Date();

      if (dueDate < today) {
        // check how manys days overdue
        const daysOverdue = Math.floor(
          (today.valueOf() - dueDate.valueOf()) / (1000 * 3600 * 24),
        ).valueOf();

        // assign due category base on days overdue
        const category =
          daysOverdue === -2
            ? OverDueCategory.D2
            : daysOverdue === -1
            ? OverDueCategory.D1
            : daysOverdue === 0
            ? OverDueCategory.D0
            : daysOverdue <= 7 && !(daysOverdue < 1)
            ? OverDueCategory.S1
            : daysOverdue <= 14 && !(daysOverdue < 8)
            ? OverDueCategory.S2
            : daysOverdue <= 30 && !(daysOverdue < 15)
            ? OverDueCategory.M1
            : daysOverdue <= 60 && !(daysOverdue < 31)
            ? OverDueCategory.M2
            : daysOverdue > 60
            ? OverDueCategory.M3
            : null;

        await prisma.loans.update({
          where: {
            id: loan.id,
          },
          data: {
            overDueCategory: category,
          },
        });
      }
    });

    logger.debug('Loans overdue category updated');
    //TODO: send email to users with overdue loans
    //TODO: send mail to teamleads of collector deparment with overdue loans
  } catch (error) {
    logger.error(error);
    logger.error('Error updating loans overdue category');
  }
};
