import express from 'express'
import { userRoute } from './controllers/user.controller'

export const routes = express.Router()

routes.use('/user', userRoute)