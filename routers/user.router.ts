import {Router} from "express";
import {UserRecord} from "../records/user.record";
import {decryptText, encryptText} from "../utils/cipher";
import {salt} from "../config/config";
import {TasksRecord} from "../records/tasks.record";
import {NotesRecord} from "../records/notes.record";
import {TodosRecord} from "../records/todos.record";

export const userRouter = Router()

    .post('/user/registration', async (req, res) => {
        const pass = await encryptText(req.body.password, req.body.password, salt);
        const checkUser = await UserRecord.getUser(req.body.name);
        if (checkUser && checkUser.name === req.body.name) {
            res.json({message: 'username is already in use'})
        } else {
            const newUserRegister = await new UserRecord({
                ...req.body,
                password: pass.encrypted,
                ivHex: pass.iv,
                userRole: 'employer',
            });
            await newUserRegister.insertUser();
            res
                .status(201)
                .json({message: 'user added'})
        }
    })

    .post('/', async (req, res) => {
        const user = await UserRecord.getUser(req.body.name);
        if (user) {
            try {
                const decryptPass = await decryptText(user.password, req.body.password, salt, user.ivHex);
                if (decryptPass === req.body.password) {
                    const simpleUserInfo = {
                        name: user.name,
                        id: user.id,
                        userRole: user.userRole
                    }
                    res
                        .status(200)
                        .json(simpleUserInfo)
                }
            } catch (err) {
                if (err) {
                    res
                        .status(401)
                        .json({message: 'login attempt'})
                }
            }
        } else {
            res
                .status(404)
                .json({message: 'user not found!'})
        }
    })

    .get('/user/:userId', async (req, res) => {
        const user = await UserRecord.getOneUser(req.params.userId);
        const taskLength = await TasksRecord.getAllSimpleInfoTask(req.params.userId)
        const notesLength = await NotesRecord.getAllUserNotes(req.params.userId)
        const todosLength = await TodosRecord.getAllUserTodos(req.params.userId)
        const archiveLength = await TasksRecord.getAllTaskByUser('archive', req.params.userId)
        const simpleUserInfo = {
            id: user.id,
            createdAt: user.createdAt,
            userRole: user.userRole,
            userStatus: user.userStatus,
            taskLength: taskLength.length,
            notesLength: notesLength.length,
            todosLength: todosLength.length,
            archiveLength: archiveLength.length
        }
        res
            .status(200)
            .json(simpleUserInfo)
    })

    .patch('/user', async (req, res) => {
        const user = await UserRecord.getOneUser(req.body.userId);
        const updatedUserStatus = await new UserRecord({
            ...user,
            userStatus: req.body.userStatus,
        })
        await updatedUserStatus.update();
        res.status(200);
    })

