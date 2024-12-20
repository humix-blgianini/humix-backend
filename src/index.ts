import express from "express"
import { routes } from "./routes"
import * as socketio from "socket.io"
import { createServer } from 'http'
 
require("dotenv").config()
const cors = require("cors")
const app = express()
const httpServer = createServer(app)
 
app.use(cors())

const corsOptions = {
  origin: '*', 
  methods: 'GET,POST,PUT,DELETE, PATCH',      
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,                         
};

app.options('*', cors(corsOptions))

export const io = new socketio.Server(httpServer, {
  cors: {
    origin: '*', 
    methods: 'GET,POST,PUT,DELETE, PATCH',      
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,    
  }
})
 
const PORT = process.env.PORT || 4000

app.use(express.json())

app.use('/api', routes)
 
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
});