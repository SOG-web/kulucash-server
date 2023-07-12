import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

import { deleteMonifyStore, getMonifyStore, setMonifyStore } from './store';
import { PrismaService } from 'src/prisma/prisma.service';
import {
  monnifyBankAccountVerification,
  monnifyBvnAccountVerification,
  monnifyLogin,
  monnifybankList,
} from './constants/api';

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

      // save the current time to setMonifyStore
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
}
