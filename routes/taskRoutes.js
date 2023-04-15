const express = require('express')
const router = express.Router()
const requireAuth = require('../middlewares/requireAuth')
const { getTasks, createTask, deleteTask } = require('../controllers/taskController')

//middleware
router.use(requireAuth)

//get all the tasks
router.get('/', getTasks)

//create a new task
router.post('/create', createTask)

//delete a task
router.delete('/:id', deleteTask)

module.exports = router