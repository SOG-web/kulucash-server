import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { sendSms, send, verify } from './constant/sendchamp_api';
import { SentOtpDto, ConfirmOtpDto } from './dto/otp.dto';
import { SentOtpInterface } from './interface/otp.interface';
import axios from 'axios';

@Injectable()
export class SmsService {
  constructor(private readonly config: ConfigService) {}

  async sendSMS({ to, message }: { to: string[]; message: string }) {
    // console.log("SMS service is running");
    const secret =
      process.env.SENDCHAMP_KEY || this.config.get('SENDCHAMP_KEY');
    //console.log('SMS', secret);
    //console.log('SMS to', to);
    //console.log('SMS message', message);
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${secret}`,
          accept: 'application/json',
          'content-type': 'application/json',
        },
      };

      const data = {
        to,
        message,
        sender_name: 'seepspring',
        route: 'dnd',
      };

      //console.log('sms data', data);

      const { data: res } = await axios.post(sendSms, data, config);
      //console.log('sms res', res);
      return res;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async sendOTP(info: SentOtpDto): Promise<SentOtpInterface> {
    const secret =
      process.env.SENDCHAMP_KEY || this.config.get('SENDCHAMP_KEY');
    const options = {
      method: 'POST',
      url: send,
      headers: {
        Accept: 'application/json,text/plain,*/*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secret}`,
      },
      data: {
        meta_data: info.meta_data,
        channel: info.channel,
        sender: info.sender,
        token_type: info.token_type,
        token_length: info.token_length,
        expiration_time: info.expiration_time,
        customer_mobile_number: info.customer_mobile_number,
        customer_email_address: info.customer_email_address,
      },
    };
    try {
      const { data } = await axios(options);

      const res = { data, info };
      // console.log(data);
      return res;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }

  async confirmOTP(info: ConfirmOtpDto) {
    const secret =
      process.env.SENDCHAMP_KEY || this.config.get('SENDCHAMP_KEY');
    const options = {
      method: 'POST',
      url: verify,
      headers: {
        Accept: 'application/json,text/plain,*/*',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${secret}`,
      },
      data: {
        verification_reference: info.verification_reference,
        verification_code: info.verification_code,
      },
    };
    try {
      const { data } = await axios(options);
      console.log(data);
      return data;
    } catch (error) {
      console.log(error);
      throw new Error(error);
    }
  }
}
