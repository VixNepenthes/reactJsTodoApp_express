import 'dotenv/config'

export const env = {
  MONGO_URI: process.env.MONGO_URI,
  DATABASE_NAME: process.env.DATABASE_NAME,

  LOCAL_DEV_APP_HOST: process.env.LOCAL_DEV_APP_HOST,
  LOCAL_DEV_APP_PORT: process.env.LOCAL_DEV_APP_PORT,

  BUILD_MODE: process.env.BUILD_MODE,

  AUTHOR: process.env.AUTHOR,
  ACCESS_TOKEN_SECRET_SIGNATURE: process.env.ACCESS_TOKEN_SECRET_SIGNATURE,
  REFRESH_TOKEN_SECRET_SIGNATURE: process.env.REFRESH_TOKEN_SECRET_SIGNATURE
}
