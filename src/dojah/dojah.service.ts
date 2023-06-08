/* eslint-disable @typescript-eslint/no-empty-function */
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { type } from 'os';
import { BVNResponse } from './objects/bnv';

@Injectable()
export class DojahService {
  constructor(private readonly config: ConfigService) {}

  headers = {
    Authorization: `${
      this.config.get('DOJAH_SECRET_KEY') || process.env.DOJAH_SECRET_KEY
    }`,
    Appid: `${this.config.get('DOJAH_APP_ID') || process.env.DOJAH_APP_ID}`,
  };

  async getBanks() {}

  async verifyAccountNumber(accountNumber: string, bankCode: string) {}

  async checkBvn(bvn: string): Promise<BVNResponse> {
    try {
      const { data } = await axios.get(
        `${
          this.config.get('DOJAH_ENDPOINT') || process.env.DOJAH_ENDPOINT
        }/api/v1/kyc/bvn/advance?bvn=${bvn}`,
        {
          headers: this.headers,
        },
      );
      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
