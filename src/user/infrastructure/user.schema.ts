import { Schema } from 'mongoose';

export const UserSchema = new Schema({
  name: String,
  surname: String,
  email: String,
  subscriptionAlerts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'WeatherStation',
    },
  ],
});