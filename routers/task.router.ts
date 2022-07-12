import {Router} from "express";
import {TasksRecord} from "../records/tasks.record";
import {UserRecord} from "../records/user.record";

export const TaskRouter = Router()

    .get('/', async (req, res) => {
        const tasks = await TasksRecord.getAllTask();
        const users = await UserRecord.getAllUser();
        const simpleUserInfo = users.map(user => ({userId: user.id, name: user.name}));
        res.json([tasks,simpleUserInfo])
    })