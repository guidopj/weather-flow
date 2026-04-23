import { Schema, Types } from "mongoose";

export const MeasurementSchema = new Schema({
  weatherStationId: String,
  timestamp: Date,
  temperature: Number,
  humidity: Number,
  atmosphericPressure: Number,

  alarmType: {
    type: String,
    enum: ['EXTREME_HEAT', 'FROST', 'LOW_PRESSURE', 'HIGH_HUMIDITY'],
    required: false,
    default: null,
  },

  stationId: {
    type: Types.ObjectId,
    ref: 'WeatherStation',
  },
});