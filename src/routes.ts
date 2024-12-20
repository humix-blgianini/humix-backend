import express from 'express'
import { userRoute } from './controllers/user.controller'
import { albumRoute } from './controllers/album.controller'

export const routes = express.Router()

routes.use('/user', userRoute)
routes.use('/album', albumRoute)