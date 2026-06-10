import { MongoClient } from "mongodb"

const MONGO_URI = process.env.MONGO_URI
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY

const url = `https://api.openweathermap.org/data/2.5/weather?lat=-34.6037&lon=-58.3816&units=metric&appid=${OPENWEATHER_API_KEY}`

async function run() {
  const res = await fetch(url)
  const data = await res.json()

  if (data.cod !== 200) {
    throw new Error("OpenWeather error: " + JSON.stringify(data))
  }

  const client = new MongoClient(MONGO_URI)
  await client.connect()

  const db = client.db("weather")
  const collection = db.collection("observations")

  await collection.insertOne({
    ...data,
    createdAt: new Date(),
  })

  console.log("Saved weather:", data.main.temp)

  await client.close()
}

run().catch(err => {
  console.error(err)
  process.exit(1)
})