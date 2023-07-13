import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { MonnifyPaymentStatus, TransactionType } from '@prisma/client';

import { deleteMonifyStore, getMonifyStore, setMonifyStore } from './store';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  monnifyBankAccountVerification,
  monnifyBvnAccountVerification,
  monnifyChargeCardToken,
  monnifyLogin,
  monnifyVerifyPayment,
  monnifybankList,
} from './constants/api';
import { verifyPaymentResponseType } from './objects/response';

@Injectable()
export class MonnifyService {
  constructor(
    private readonly config: ConfigService,
    private prisma: PrismaService,
  ) {}

  baseUrl = this.config.get('MONNIFY_ENDPOINT');
  apiKey = this.config.get('MONNIFY_KEY');
  secretKey = this.config.get('MONNIFY_SECRET_KEY');

  checkToken() {
    try {
      // check the last time the token was generated from the store
      const tokenTime = getMonifyStore('tokenTime');

      if (!tokenTime) {
        return false;
      }

      // and compare it with the current time, if it is greater than 50 minutes return false
      if (Date.now() - tokenTime > 3000000) {
        deleteMonifyStore('accessToken');
        deleteMonifyStore('tokenTime');
        return false;
      }

      return true;
    } catch (error) {
      return false;
    }
  }

  async login() {
    try {
      const options = {
        method: 'POST',
        url: `${this.baseUrl}${monnifyLogin}`,
        headers: {
          Authorization: `Basic ${Buffer.from(
            `${this.apiKey}:${this.secretKey}`,
          ).toString('base64')}`,
        },
      };

      const response = await axios(options);

      // save the current time to setMonnifyStore
      setMonifyStore('tokenTime', Date.now());
      setMonifyStore('accessToken', response.data.responseBody.accessToken);

      return true;
    } catch (error) {
      return false;
    }
  }

  async bankList() {
    try {
      // check if the token is still valid
      const token = this.checkToken();

      // if the token is not valid, login again

      if (!token) {
        const login = await this.login();

        if (!login) {
          throw new ForbiddenException({
            message: 'Unable to fetch bank list',
            error: 'Unable to login',
            status: false,
          });
        }

        // console.log('logged in');
      }

      const accessToken = getMonifyStore('accessToken');

      // console.log(accessToken);

      const options = {
        method: 'GET',
        url: `${this.baseUrl}${monnifybankList}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios(options);

      return {
        message: 'Bank list fetched successfully',
        status: true,
        data: response.data.responseBody,
      };
    } catch (error) {
      throw new ForbiddenException({
        message: 'Unable to fetch bank list',
        error,
        status: false,
      });
    }
  }

  async bankAccountVerification(accountNumber: string, bankCode: string) {
    console.log(accountNumber, bankCode);
    try {
      // check if the token is still valid
      const token = this.checkToken();

      // if the token is not valid, login again

      if (!token) {
        const login = await this.login();

        if (!login) {
          throw new ForbiddenException({
            message: 'Unable to verify bank account',
            error: 'Unable to login',
            status: false,
          });
        }

        // console.log('logged in');
      }

      const accessToken = getMonifyStore('accessToken');

      // console.log(accessToken);

      const options = {
        method: 'GET',
        url: `${this.baseUrl}${monnifyBankAccountVerification}accountNumber=${accountNumber}&bankCode=${bankCode}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axios(options);

      return {
        message: 'Bank verified successfully',
        status: true,
        data: response.data.responseBody,
      };
    } catch (error) {
      throw new ForbiddenException({
        message: 'Unable to verify bank account',
        error,
        status: false,
      });
    }
  }

  async bvnAccountVerification(
    accountNumber: string,
    bankCode: string,
    bvn: string,
  ) {
    try {
      // check if the token is still valid
      const token = this.checkToken();

      // if the token is not valid, login again

      if (!token) {
        const login = await this.login();

        if (!login) {
          throw new ForbiddenException({
            message: 'Unable to verify bank account',
            error: 'Unable to login',
            status: false,
          });
        }

        // console.log('logged in');
      }

      const accessToken = getMonifyStore('accessToken');

      // console.log(accessToken);

      const options = {
        method: 'POST',
        url: `${this.baseUrl}${monnifyBvnAccountVerification}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          bvn,
          accountNumber,
          bankCode,
        },
      };

      const response = await axios(options);

      if (!response.data.requestSuccessful) {
        throw new ForbiddenException({
          message: 'Unable to verify bank account',
          error: response.data.responseMessage,
          status: false,
        });
      }

      return {
        message: 'Bank verified successfully',
        status: true,
        data: response.data.responseBody,
      };
    } catch (error) {
      throw new ForbiddenException({
        message: 'Unable to verify bank account',
        error,
        status: false,
      });
    }
  }

  async initPayment(UserPropertiesId: string) {
    try {
      // generate a unique reference(unique string with date) for the transaction and save it to the database
      const reference = `${Date.now()} - ${Math.floor(
        Math.random() * 1000000000,
      )} `;

      const transaction = await this.prisma.transactions.create({
        data: {
          reference,
          transaction_type: TransactionType.CARDLINK,
          amount: 50,
          UserProperties: {
            connect: {
              id: UserPropertiesId,
            },
          },
        },
      });

      return {
        message: 'Transaction initialized successfully',
        status: true,
        data: transaction,
      };
    } catch (error) {
      throw new ForbiddenException({
        message: 'Unable to initialize transaction',
        error,
        status: false,
      });
    }
  }

  async verifyPayment(reference: string, id: string, userId: string) {
    try {
      // check if the token is still valid
      const token = this.checkToken();

      // if the token is not valid, login again

      if (!token) {
        const login = await this.login();

        if (!login) {
          throw new ForbiddenException({
            message: 'Unable to verify payment',
            error: 'Unable to login',
            status: false,
          });
        }

        // console.log('logged in');
      }

      const accessToken = getMonifyStore('accessToken');

      // console.log(accessToken);

      const options = {
        method: 'GET',
        url: `${this.baseUrl}${monnifyVerifyPayment}${reference}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const { data }: { data: verifyPaymentResponseType } = await axios(
        options,
      );

      if (!data.requestSuccessful) {
        throw new ForbiddenException({
          message: 'Unable to verify payment',
          error: data.responseMessage,
          status: false,
        });
      }

      const transaction = await this.prisma.transactions.update({
        where: {
          id: id,
        },
        data: {
          payment_status: data.responseBody
            .paymentStatus as MonnifyPaymentStatus,
        },
      });

      if (
        !data.responseBody.cardDetails.reusable &&
        !data.responseBody.cardDetails.supportsTokenization
      ) {
        throw new ForbiddenException({
          message: 'Unable to verify payment',
          error: 'Card is not reusable',
          status: false,
        });
      }

      await this.prisma.cardDetail.create({
        data: {
          card_no: data.responseBody.cardDetails.last4,
          card_token: data.responseBody.cardDetails.cardToken,
          card_name: data.responseBody.customer.name,
          email: data.responseBody.customer.email,
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });

      return {
        message: 'Payment verified successfully',
        status: true,
        data: transaction,
      };
    } catch (error) {
      throw new ForbiddenException({
        message: 'Unable to verify payment',
        error,
        status: false,
      });
    }
  }

  async chargeTokenizedCard(
    id: string,
    desc: string,
    amount: number,
    userId: string,
    loanId: string,
  ) {
    try {
      const card = await this.prisma.cardDetail.findUnique({
        where: {
          id,
        },
      });

      if (!card) {
        throw new ForbiddenException({
          message: 'Unable to charge card',
          error: 'Card does not exist',
          status: false,
        });
      }

      // check if the token is still valid
      const token = this.checkToken();

      // if the token is not valid, login again

      if (!token) {
        const login = await this.login();

        if (!login) {
          throw new ForbiddenException({
            message: 'Unable to verify payment',
            error: 'Unable to login',
            status: false,
          });
        }

        // console.log('logged in');
      }

      const accessToken = getMonifyStore('accessToken');

      const reference = `${Date.now()} - ${Math.floor(
        Math.random() * 1000000000,
      )} `;

      const options = {
        method: 'POST',
        url: `${this.baseUrl}${monnifyChargeCardToken}`,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: {
          cardToken: card.card_token,
          amount: amount,
          customerName: card.card_name,
          customerEmail: card.email,
          paymentReference: reference,
          paymentDescription: desc,
          currencyCode: 'NGN',
          contractCode: '675234136342',
          apiKey: 'MK_TEST_VR7J3UAACH',
          metaData: {
            ipAddress: '127.0.0.1',
            deviceType: 'mobile',
          },
        },
      };

      const { data } = await axios(options);

      //TODO: link the loan
      //TODO: save the transaction
    } catch (error) {
      throw new ForbiddenException({
        message: 'Unable to charge card',
        error,
        status: false,
      });
    }
  }
}
