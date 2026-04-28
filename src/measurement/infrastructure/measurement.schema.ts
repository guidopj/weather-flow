import { Schema, Types } from 'mongoose';

const TemperatureSchema = new Schema(
  {
    value: { type: Number, required: true },
    unit: {
      type: String,
      enum: ['C', 'F', 'K'],
      required: true,
    },
  },
  { _id: false },
);

const HumiditySchema = new Schema(
  {
    value: { type: Number, required: true },
  },
  { _id: false },
);

export const MeasurementSchema = new Schema({
  weatherStationId: String,
  timestamp: Date,

  temperature: {
    type: TemperatureSchema,
    required: true,
  },

  humidity: {
    type: HumiditySchema,
    required: true,
  },
  atmosphericPressure: Number,

  alarmType: {
    type: String,
    enum: ['NONE', 'EXTREME_HEAT', 'FROST', 'LOW_PRESSURE', 'HIGH_HUMIDITY'],
    required: false,
    default: null,
  },

  stationId: {
    type: Types.ObjectId,
    ref: 'WeatherStation',
  },
});