import {NewTask, SimpleInfoTask, TaskInterface} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {v4 as uuid} from "uuid";

type NewTaskType = [TaskInterface[], FieldPacket[]];
type NewSimpleTaskType = [SimpleInfoTask[], FieldPacket[]];

export class TasksRecord implements TaskInterface {
    id: string;
    title: string;
    text: string;
    nip: number;
    telNumber: number;
    deadline: Date;
    createdAt: Date;
    isDone: boolean | string;
    userId: string | null;
    status: string;


    constructor(obj: NewTask) {
        if (!obj.title || obj.title.length > 30) {
            throw new ValidationError('Title cannot be empty and exceed 30 characters');
        }
        if (!obj.text || obj.text.length > 300) {
            throw new ValidationError('Text cannot be empty and exceed 300 characters');
        }
        if (!obj.nip) {
            throw new ValidationError("Client id cannot be empty")
        }
        if (!obj.telNumber) {
            throw new ValidationError('Client number cannot be empty')
        }
        if (!obj.deadline) {
            throw new ValidationError('Deadline cannot be empty')
        }
        this.id = obj.id;
        this.title = obj.title;
        this.text = obj.text;
        this.nip = obj.nip;
        this.telNumber = obj.telNumber;
        this.deadline = obj.deadline;
        this.createdAt = obj.createdAt;
        this.isDone = obj.isDone;
        this.userId = obj.userId;
        this.status = obj.status;

    }

    static async getAllTask(status: string): Promise<TaskInterface[]> {
        const [results] = await pool.execute("SELECT * FROM `tasks` WHERE `status`=:status ORDER BY `isDone` ASC, `deadline` ASC, `userId` IS NULL", {
            status,
        }) as NewTaskType;
        return results.map(task => new TasksRecord(task));
    }

    static async searchTask(searchingValue: string): Promise<TaskInterface[]> {
        const [results] = await pool.execute("SELECT * FROM `tasks` WHERE `nip`=:searchingValue", {
            searchingValue,
        }) as NewTaskType;
        return results.map(task => new TasksRecord(task));
    }

    static async getOneTask(id: string): Promise<TaskInterface> {
        const [result] = await pool.execute("SELECT * FROM `tasks` WHERE `id`=:id", {
            id,
        }) as NewTaskType;
        return result.length === 0 ? null : new TasksRecord(result[0]);
    }

    async insetTask(): Promise<void> {
        if (!this.id) {
            this.id = uuid();
        } else {
            throw new ValidationError('Cannot insert something that is already inserted!')
        }
        this.status = 'active';
        await pool.execute("INSERT INTO `tasks`(`id`,`title`,`text`,`nip`,`telNumber`,`isDone`,`createdAt`,`deadline`,`userId`,`status`) VALUES(:id,:title,:text,:nip,:telNumber,:isDone,:createdAt,:deadline,:userId,:status)", this)
    }

    static async updateUser(id: string, userId: string): Promise<void> {
        await pool.execute("UPDATE `tasks` SET `userId`=:userId WHERE `id`=:id", {
            id,
            userId,
        });
    }

    static async updateIsDone(id: string, isDone: string): Promise<void> {
        await pool.execute("UPDATE `tasks` SET `isDone`=:isDone WHERE `id`=:id", {
            isDone,
            id,
        });
    }

    static async updateSetArchive(id: string, status: string): Promise<void> {
        await pool.execute("UPDATE `tasks` SET `status`=:status WHERE `id`=:id", {
            status,
            id,
        });
    }

    static async delete(id: string): Promise<void> {
        await pool.execute("DELETE FROM `tasks` WHERE `id`=:id", {
            id,
        })
    }

    static async getAllSimpleInfoTask(id: string): Promise<SimpleInfoTask[]> {
        const [results] = await pool.execute("SELECT `title`,`text`,`id` FROM `tasks` WHERE `userId`=:id AND`isDone`='0' ORDER BY `deadline` DESC", {
            id,
        }) as NewSimpleTaskType;
        return results;
    }

    static async getAllSimpleInfoNewTask(): Promise<SimpleInfoTask[]> {
        const [results] = await pool.execute("SELECT `title`,`text`,`id` FROM `tasks` WHERE `userId` IS NULL AND`isDone`='0' ORDER BY `deadline` DESC", {
            userId: "NULL",
        }) as NewSimpleTaskType;
        return results;
    }

}