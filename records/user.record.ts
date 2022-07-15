import {NewUser, UserInterface} from "../types";
import {ValidationError} from "../utils/errors";
import {FieldPacket} from "mysql2";
import {pool} from "../utils/db";
import {v4 as uuid} from 'uuid';

type AdNewUser = [UserInterface[], FieldPacket[]];

export class UserRecord implements UserInterface {
    id: string;
    name: string;
    password: string;
    isAdmin: boolean;
    createdAt: Date;
    ivHex: string;

    constructor(obj: NewUser) {
        if (!obj.name || obj.name.length > 100) {
            throw new ValidationError('Name cannot be empty and cannot exceed 50 characters!')
        }
        if (!obj.password) {
            throw new ValidationError('Use strong password!')
        }
        this.id = obj.id;
        this.name = obj.name;
        this.password = obj.password;
        this.isAdmin = obj.isAdmin;
        this.createdAt = obj.createdAt;
        this.ivHex = obj.ivHex;
    }

    static async getUser(name: string): Promise<UserInterface> {
        const [result] = await pool.execute("SELECT * FROM `users` WHERE name=:name", {
            name,
        }) as AdNewUser;
        return result.length === 0 ? null : new UserRecord(result[0]);
    }

    static async getAllUser(): Promise<UserInterface[]> {
        const [results] = await pool.execute("SELECT * FROM `users`") as AdNewUser;
        return results.map(user => new UserRecord(user));
    }

    async insertUser(): Promise<void> {
        this.isAdmin = false;
        if (!this.id) {
            this.id = uuid();

        } else {
            throw new ValidationError('Cannot insert something that is already inserted!');
        }
        await pool.execute("INSERT INTO `users` (`id`,`name`,`password`,`isAdmin`,`ivHex`) VALUES(:id,:name,:password,:isAdmin,:ivHex)", this);
    }
}

