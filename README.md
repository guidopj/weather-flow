## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm start
```

## Run tests

```bash
# unit tests
$ npm run test

# test coverage
$ npm run test:cov
```

## Create Measurement

![Create Measurement Diagram](https://github.com/user-attachments/assets/be62f287-57b1-4c96-a87b-70b8b8a04c8b)

---

## 🧩 Flow Description

1. A `WeatherStation` sends a measurement to `MeasurementService`
2. The service retrieves the station from `WeatherStationRepository`
3. If the station does not exist → throws `NotFoundException`
4. A `Measurement` entity is created
5. The measurement is persisted via `MeasurementRepository`
6. If the measurement is an anomaly:
   - Users subscribed to that station are retrieved via `UserRepository`
   - Each user is notified through `NotificationService`

---

## 🧱 Key Concepts (DDD)

- **Entities**: `Measurement`, `WeatherStation`, `User`
- **Repositories**: abstraction for persistence
- **Domain Logic**: anomaly detection inside `Measurement`
- **Application Service**: `MeasurementService` orchestrates the flow
- **Side Effects**: notifications triggered only on anomalies
