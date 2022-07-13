import {Router} from "express";
import {TasksRecord} from "../records/tasks.record";
import {UserRecord} from "../records/user.record";

export const TaskRouter = Router()

    .get('/', async (req, res) => {
        const tasks = await TasksRecord.getAllTask();
        const users = await UserRecord.getAllUser();
        const simpleUserInfo = users.map(user => ({userId: user.id, name: user.name}));
        res.json([tasks, simpleUserInfo])
    })

    .post('/', async (req, res) => {
        const newTask = await new TasksRecord({
            ...req.body,
            createdAt: new Date(),
            isDone: false,
            userId: null,
        })
        await newTask.insetTask();
        res.json({message: "ok"})
    })

    .patch('/one/:taskId', async (req, res) => {
        console.log(req.params.taskId);
        console.log("user:", req.body.userId)
        await TasksRecord.updateUser(req.params.taskId, req.body.userId);
        res.json({message: 'ok'});
    })