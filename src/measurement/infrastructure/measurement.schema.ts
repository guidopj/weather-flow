import { Schema, Types } from "mongoose"

 const AlarmType = new Schema({
  alarmType: {
    type: String,
    enum: ["Ninguna", "Calor Extremo", "Helada", "Tormenta"],
    required: true,
  },
});

export const MeasurementSchema = new Schema({
  weatherStationId: String,
       timestamp: Date,
       temperature: Number,
       humidity: Number,
       atmosphericPressure: Number,
       alarmType: AlarmType,
       stationId: {
    type: Types.ObjectId,
    ref: 'WeatherStation',
  },
})