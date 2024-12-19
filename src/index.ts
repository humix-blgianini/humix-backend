import express from "express"
 
require("dotenv").config()
const cors = require("cors")
const app = express()
 
app.use(cors())
 
const PORT = process.env.PORT || 4000

app.use(express.json())
 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
});