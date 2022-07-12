import {NewTask, TaskInterface} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";

type NewTaskType = [TaskInterface[], FieldPacket[]];

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

    }

    static async getAllTask(): Promise<TaskInterface[]> {
        const [results] = await pool.execute("SELECT * FROM `tasks`") as NewTaskType;
        return results.map(task => new TasksRecord(task));
    }
}