import { Schema, Types } from 'mongoose';

export const MeasurementSchema = new Schema({
  weatherStationId: String,
  timestamp: Date,

  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  atmosphericPressure: { type: Number, required: true },

  alarmType: {
    type: String,
    enum: ['NONE', 'HEAT_WAVE', 'FROST', 'LOW_PRESSURE', 'HIGH_HUMIDITY'],
    required: false,
    default: null,
  },

  stationId: {
    type: Types.ObjectId,
    ref: 'WeatherStation',
  },
});