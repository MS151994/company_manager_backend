import {Router} from "express";
import {TasksRecord} from "../records/tasks.record";

export const HomeRouter = Router()

    .get('/:userId', async (req, res) => {
        const dt = new Date().toISOString().slice(0, 10);
        const tasks = await TasksRecord.getAllSimpleInfoTask(req.params.userId, dt);
        const newTasks = await TasksRecord.getAllSimpleInfoNewTask(dt);
        res.json([tasks, newTasks])
    })