import express from "express"
import { routes } from "./routes"
 
require("dotenv").config()
const cors = require("cors")
const app = express()
 
app.use(cors())

const corsOptions = {
  origin: '*', 
  methods: 'GET,POST,PUT,DELETE, PATCH',      
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,                         
};

app.use(cors(corsOptions));
 
const PORT = process.env.PORT || 4000

app.use(express.json())

app.use('/api', routes)
 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
});