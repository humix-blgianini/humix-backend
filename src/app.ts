import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config()

const PORT = process.env.PORT

const app = express()
app.use(cors())
app.use(express.json())

const corsOptions = {
    origin: '*', 
    methods: 'GET,POST,PUT,DELETE, PATCH',      
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,                         
}

app.use(cors(corsOptions))

app.listen(PORT, () => {
    console.log(`Rodando na porta ${PORT}`)
})