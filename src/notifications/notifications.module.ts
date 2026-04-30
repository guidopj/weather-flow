import { Module } from '@nestjs/common';
import { NotificationService } from './application/notificationService';

@Module({
  providers: [NotificationService],
  exports: [NotificationService],
})
export class NotificationsModule {}
