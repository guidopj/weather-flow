
import { Schema, Types } from 'mongoose';

const Location = new Schema({
  latitude: Number,
  longitude: Number
});

export const WeatherStationSchema = new Schema({
  name: String,
  location: Location,
  sensorModel: String,
  state: Boolean,
  ownerId: {
    type: Types.ObjectId,
    ref: 'User',
  },
});
