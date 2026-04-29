import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MeasurementModule } from './measurement/measurement.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { WeatherStationModule } from './weather-station/weather-station.module';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MongooseModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService) => {
    const user = config.getOrThrow<string>('MONGO_USER');
    const pass = encodeURIComponent(config.getOrThrow<string>('MONGO_PASS'));
    const db = config.getOrThrow<string>('MONGO_DB');

    const uri = `mongodb+srv://${user}:${pass}@ac-xxxx.a72wqxl.mongodb.net/${db}?retryWrites=true&w=majority`;
    return {
      uri,
    };
  },
}),
    MeasurementModule,
    UserModule,
    WeatherStationModule,
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
