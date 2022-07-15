import {Router} from "express";
import {TasksRecord} from "../records/tasks.record";

export const HomeRouter = Router()

    .get('/:userId', async (req, res) => {
        const tasks = await TasksRecord.getAllSimpleInfoTask(req.params.userId);
        const newTasks = await TasksRecord.getAllSimpleInfoNewTask();
        res.json([tasks, newTasks])
    })

    .post('/search', async (req, res) => {
        const foundedItems = await TasksRecord.searchTask(req.body.search);
        res.json(foundedItems)
    })