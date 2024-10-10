import { StatusCodes } from 'http-status-codes'
import { ObjectId } from 'mongodb'
import { GET_DB } from '~/config/mongodb'

const TASK_COLLECTION_NAME = 'tasks'

async function getTasksById(request, response) {
  try {
    const userId = request.params.id
    const result = await GET_DB()
      .collection(TASK_COLLECTION_NAME)
      .find({ user_id: new ObjectId(userId) })
      .toArray()
    response.status(StatusCodes.OK).json(result)
  } catch (error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

async function addTask(request, response) {
  try {
    const userId = request.params.id

    const { name } = request.body
    const newTask = {
      user_id: new ObjectId(userId),
      name,
      completed: false
    }
    const result = await GET_DB().collection(TASK_COLLECTION_NAME).insertOne(newTask)
    response.status(StatusCodes.CREATED).json({ message: 'Add success' })
  } catch (error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

async function editTask(request, response) {
  try {
    const taskId = request.params.id
    const name = request.body
    const result = await GET_DB()
      .collection(TASK_COLLECTION_NAME)
      .findOneAndUpdate({ _id: new ObjectId(taskId) }, { $set: name }, { returnDocument: 'after' })
    response.status(StatusCodes.NO_CONTENT).json({})
  } catch (error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

async function deleteTask(request, response) {
  try {
    const taskId = request.params.id
    const result = await GET_DB()
      .collection(TASK_COLLECTION_NAME)
      .deleteOne({
        _id: new ObjectId(taskId)
      })
    response.status(StatusCodes.NO_CONTENT).json({})
  } catch (error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

async function checkDoneTask(request, response) {
  try {
    const taskId = request.params.id
    const result = await GET_DB()
      .collection(TASK_COLLECTION_NAME)
      .updateOne({ _id: new ObjectId(taskId) }, [{ $set: { completed: { $not: '$completed' } } }])
    response.status(StatusCodes.NO_CONTENT).json({})
  } catch (error) {
    response.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error)
  }
}

export const taskController = { getTasksById, addTask, editTask, deleteTask, checkDoneTask }
