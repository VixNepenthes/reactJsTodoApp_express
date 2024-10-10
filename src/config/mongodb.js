import { env } from './environment'

import { MongoClient, ServerApiVersion } from 'mongodb'

let trelloDatabaseInstance = null

const mongoClientInstance = new MongoClient(env.MONGO_URI, {
  // lưu ý serverApi sẽ có từ phiên bản 5.0.0, dùng nó sẽ chỉ định một stable api version cho mongodb
  // key search : stable api mongodb
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

export const CONNECT_DB = async () => {
  await mongoClientInstance.connect()

  trelloDatabaseInstance = mongoClientInstance.db(env.DATABASE_NAME)
}

export const CLOSE_DB = async () => {
  await mongoClientInstance.close()
}

export const GET_DB = () => {
  if (!trelloDatabaseInstance) throw new Error('Must connect to Database first')

  return trelloDatabaseInstance
}
