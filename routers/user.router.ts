import {Router} from "express";
import {UserRecord} from "../records/user.record";
import {decryptText, encryptText} from "../utils/cipher";
import {salt} from "../config/config";

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

