const Task = require('../models/tasks')

const getTasks = async (req, res) => {

    const { _id } = req.user

    try {
        const tasks = await Task.find({
            user_id: _id,
        }).sort({ createdAt: -1 })
        if (tasks) res.status(200).send({ tasks })
    }
    catch (err) {
        res.status(401).send({ message: "Could not fetch tasks" })
    }

}

const createTask = async (req, res) => {
    const { _id } = req.user

    const { title, description } = req.body

    try {
        const task = await Task.create({
            user_id: _id,
            title,
            description
        })
        if (task) res.status(200).send({ message: "Task added successfully.", task })
    }
    catch (err) {
        res.status(401).send({ message: "Could not create task." })
    }

}

const deleteTask = async (req, res) => {
    const { id } = req.params

    try {
        const task = await Task.findByIdAndDelete({ _id: id })
        if (!task) return res.status(400).send({ message: "No such task found" })

        res.status(200).send({ message: "Task deletion successful" })
    }
    catch (err) {
        res.status(400).send({ message: err })
    }
}

module.exports = { getTasks, createTask, deleteTask }