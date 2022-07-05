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
            res.json({message: 'added'})
        }
    })

    .post('/', async (req, res) => {
        const data = await UserRecord.getUser(req.body.name);
        let userPassMatch;
        if (!data) {
            userPassMatch = '';
            res.json({message: "user not found"});
        } else {
            userPassMatch = await decryptText(data.password, req.body.password, salt, data.ivHex);
            const simpleUserInfo = {
                name: data.name,
                id: data.id,
            }
            res.json(userPassMatch === req.body.password ? simpleUserInfo : {message: 'login attempt'});
        }
    })

