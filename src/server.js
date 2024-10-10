import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import { corsOptions } from './config/cors'
import exitHook from 'async-exit-hook'
import { CONNECT_DB, CLOSE_DB } from './config/mongodb'
import { env } from '~/config/environment'
import { APIs_V1 } from './routes/v1'
import { errorHandlingMiddleware } from './middlewares/errorMiddleware'

const START_SERVER = () => {
  const app = express()

  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(cookieParser())
  app.use(cors(corsOptions))

  // Enable req.body json data

  // Use API v1
  app.use('/v1', APIs_V1)

  // Middleware sửa lỗi
  app.use(errorHandlingMiddleware)

  if (env.BUILD_MODE === 'production') {
    // Môi trường production
    app.listen(process.env.PORT, () => {
      // eslint-disable-next-line no-console
      console.log(
        `Production: Hello ${env.AUTHOR}, Back-end Server is running successfully with port:${env.APP_PORT}`
      )
    })
  } else {
    // Môi trường local dev
    app.listen(env.LOCAL_DEV_APP_PORT, env.LOCAL_DEV_APP_HOST, () => {
      // eslint-disable-next-line no-console
      console.log(
        `Local: Hello ${env.AUTHOR}, I am running at host: ${env.LOCAL_DEV_APP_HOST} with port:${env.LOCAL_DEV_APP_PORT}`
      )
    })
  }

  exitHook(() => {
    console.log('Disconnecting from MongoDB Cloud Atlas')
    CLOSE_DB()
    console.log('Disconnected from MongoDB Cloud Atlas')
  })
}

// ;(async () => {
//   try {
//     console.log('Connecting to mongoDB cloud atlas')
//     await CONNECT_DB()
//     console.log('Connected to mongoDB cloud atlas')
//     START_SERVER()
//   } catch (error) {
//     console.error(error)
//     process.exit(0)
//   }
// })()

CONNECT_DB()
  .then(() => console.log('Connected to mongodb cloud atlas'))
  .then(() => START_SERVER())
  .catch((error) => {
    console.error(error)
    process.exit(0)
  })
