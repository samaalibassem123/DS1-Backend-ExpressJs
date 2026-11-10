import express from "express"
import connectDB from "./config/database.js"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const PORT = 3000
app.use(express.json());

const startServer = async () => {
    await connectDB()
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })

}

startServer()