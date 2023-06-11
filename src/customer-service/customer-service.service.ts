import { Injectable } from '@nestjs/common';

@Injectable()
export class CustomerServiceService {
  // available chat list: push the customer that a waiting to be assigned to a customer service
  // currently assigned chat: push the customer that is currently assigned to a customer service
  // take note of the resolve button
  // !STEPs
  // ?1. when a staff login to the system, the system will check if there is any available chat on the chatlist from the database
  // ?2. check if the staff is currently assigned to a chat on the chatlist from the database
  // ?3. if not, the system will assign the chat to the staff
  // ?4. alaways check when a user disconnect from the soket and remove the user from the chatlist and delete there message from the database
}
