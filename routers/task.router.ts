import {Router} from "express";
import {TasksRecord} from "../records/tasks.record";
import {UserRecord} from "../records/user.record";
import {TodosRecord} from "../records/todos.record";

export const TaskRouter = Router()

    .get('/', async (req, res) => {
        const tasks = await TasksRecord.getAllTask("active");
        const users = await UserRecord.getAllUser();
        const simpleUserInfo = users.map(user => ({userId: user.id, name: user.name}));
        res.json([tasks, simpleUserInfo])
    })

    .get('/archive', async (req, res) => {
        const archiveTasks = await TasksRecord.getAllTask("archive");
        res.json(archiveTasks);
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
        await TasksRecord.updateUser(req.params.taskId, req.body.userId);
        const createTodo = await new TodosRecord({
            title: req.body.title,
            text: req.body.text,
            createdAt: new Date(),
            deadline: req.body.deadline,
            highPriority: false,
            userId: req.body.userId,
            isActive: true,
        })
        await createTodo.insertTodo();
        res.json({message: 'ok'});
    })

    .patch('/isdone/:taskId', async (req, res) => {
        await TasksRecord.updateIsDone(req.params.taskId, req.body.isDone);
        res.json({message: 'setting'})
    })

    .patch('/setarchive/:taskId', async (req, res) => {
        await TasksRecord.updateSetArchive(req.params.taskId, req.body.status);
        res.json({message: 'setting'})
    })

    .delete('/archive/:id', async (req, res) => {
        await TasksRecord.delete(req.params.id);
        res.json({message: 'deleted'})
    })
