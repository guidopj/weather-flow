import { Schema, Types } from 'mongoose';

export const UserSchema = new Schema({
  name: String,
  surname: String,
  email: String,
  subscriptionList: {
      type: Array<Types.ObjectId>,
      ref: 'WeatherStation',
    },
});
