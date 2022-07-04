import {Router} from "express";
import {UserRecord} from "../records/user.record";

export const userRouter = Router()

    .post('/user/registration', async (req, res) => {
        const newUserRegister = await new UserRecord(req.body);
        const checkUser = await UserRecord.getUser(req.body.name);
        if (checkUser && checkUser.name === req.body.name) {
            res.json({message: 'username is already in use'})
        } else {
            await newUserRegister.insertUser()
            res.json({message: 'added'})
        }
    })

    .post('/', async (req, res) => {
        const data = await UserRecord.getUser(req.body.name);

        if (!data) {
            res.json({message: "user not found"})
        } else {
            const simpleUserInfo = {
                name: data.name,
                id: data.id,
            }
            res.json(data.password === req.body.password ? simpleUserInfo : {message: 'login attempt'});
        }
    })

