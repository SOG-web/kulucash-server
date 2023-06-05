export interface SentOtpInterface {
  data: {
    code: number;
    data: {
      business_uid: string;
      reference: string;
      channel: {
        id: number;
        name: string;
        is_active: boolean;
      };
      token: string;
      status: string;
    };
    errors: any;
    message: string;
    status: string;
  };
  info: any;
}

// {
//   "code": 200,
//   "data": {
//     "business_uid": "b16b7de7-4439-4dae-9b44-b916f2ac254d",
//     "reference": "MN-OTP-af67b032-382a-4726-bed8-f55c3c23674a",
//     "channel": {
//       "id": 1,
//       "name": "sms",
//       "is_active": true
//     },
//     "token": "RX8EQ",
//     "status": "sent"
//   },
//   "errors": null,
//   "message": "Success",
//   "status": "success"
// }
