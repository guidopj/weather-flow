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

## DB Schema

<img width="383" height="597" alt="db-model" src="https://github.com/user-attachments/assets/e5ffba56-38e6-4caf-af9d-0cb0d9386ba1" />

## C4 diagrams

### C1 - Context

![C1 Context Diagram](https://github.com/user-attachments/assets/7089d212-f7b5-4786-b934-d0d2bfd0ee89)

### C2 - Containers

<img width="1011" height="471" alt="C3_Components" src="https://github.com/user-attachments/assets/1ae3a10b-481b-4327-89f9-4ed72301cec9" />

![C2 Containers Diagram](https://github.com/user-attachments/assets/bec7ff36-c98a-4244-96af-f9503ec91a52)

### C3 - Measurement Component

<img width="1011" height="471" alt="C3_Components" src="https://github.com/user-attachments/assets/18986bef-41f3-495d-b6a4-f7fd107406ed" />

### video

[Ver demo en Loom](https://www.loom.com/share/166f123fc6494e2696b54f4f4cd56a0d)
