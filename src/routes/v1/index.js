import express from 'express'
import { StatusCodes } from 'http-status-codes'
import { userRoute } from '~/routes/v1/userRoute'
import { dashboardRoute, taskRoute } from './taskRoute'
const Router = express.Router()

Router.get('/status', (request, response) => {
  response.status(StatusCodes.OK).json({ message: 'API v1 are ready to use' })
})

Router.use('/users', userRoute)

Router.use('/tasks', taskRoute)

export const APIs_V1 = Router
