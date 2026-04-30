import { Injectable } from "@nestjs/common";

@Injectable()
export class NotificationService {
  notify(email: string, message: string) {
    console.log(`Sending to ${email}: ${message}`);
  }
}