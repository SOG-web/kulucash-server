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
          daysOverdue === 3
            ? OverDueCategory.D3
            : daysOverdue === 7
            ? OverDueCategory.D7
            : OverDueCategory.D14;
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
