import { MongoClient } from "mongodb"

const MONGO_URI = process.env.MONGO_URI
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY

async function run() {
  const client = new MongoClient(MONGO_URI)
  await client.connect()

  const db = client.db("weather-flow-db")
  const collection = db.collection("weatherstations")

  const stations = await collection.find({}).toArray()

  console.log(`Stations found: ${stations.length}`)

  for (const station of stations) {
    const { latitude, longitude } = station.location || {}

    if (!latitude || !longitude) {
      console.log("Skipping station (no coords)", station._id)
      continue
    }

    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${OPENWEATHER_API_KEY}`

    try {
      const res = await fetch(url)
      const data = await res.json()

      if (data.cod !== 200) {
        console.log("API error for station", station._id, data)
        continue
      }

      console.log("Weather OK:", station._id, data.main.temp)

      // opcional: guardar por estación
      await collection.updateOne(
        { _id: station._id },
        {
          $set: {
            lastWeather: data,
            updatedAt: new Date(),
          },
        }
      )

    } catch (err) {
      console.error("Error station:", station._id, err)
    }
  }

  await client.close()
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})