import express from 'express'
import { taskController } from '~/controllers/taskController'
import { authMiddleware } from '~/middlewares/authMiddleware'
const Router = express.Router()

Router.route('/gettasksbyid/:id').get(authMiddleware.isAuthorized, taskController.getTasksById)

Router.route('/addtask/:id').post(authMiddleware.isAuthorized, taskController.addTask)

Router.route('/edittask/:id').patch(authMiddleware.isAuthorized, taskController.editTask)

Router.route('/deletetask/:id').delete(authMiddleware.isAuthorized, taskController.deleteTask)

Router.route('/checkdonetask/:id').patch(authMiddleware.isAuthorized, taskController.checkDoneTask)

export const taskRoute = Router
