import {NewTodo, TodosInterface} from "../types";
import {ValidationError} from "../utils/errors";
import {v4 as uuid} from 'uuid';
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";

type NewTodoType = [TodosInterface[], FieldPacket[]];

export class TodosRecord implements TodosInterface {
    id: string;
    title: string;
    text: string;
    createdAt: Date;
    deadline: Date;
    highPriority: boolean | string;
    userId: string;
    isActive: boolean | string;

    constructor(obj: NewTodo) {
        if (!obj.title || obj.title.length > 50) {
            throw new ValidationError('Title cannot be empty and exceed 30 characters');
        }
        if (!obj.text || obj.text.length > 200) {
            throw new ValidationError('Todos text length max 200 characters');
        }
        if (!obj.deadline) {
            throw new ValidationError('Data cannot be empty');
        }
        this.id = obj.id;
        this.title = obj.title;
        this.text = obj.text;
        this.createdAt = obj.createdAt;
        this.deadline = obj.deadline;
        this.highPriority = obj.highPriority;
        this.userId = obj.userId;
        this.isActive = obj.isActive;
    }

    async insertTodo(): Promise<void> {
        if (!this.id) {
            this.id = uuid();
        } else {
            throw new ValidationError('Cannot insert something that is already inserted!');
        }
        await pool.execute("INSERT INTO `todos`(`id`,`title`,`text`,`deadline`,`highPriority`,`userId`,`isActive`) VALUES(:id,:title,:text,:deadline,:highPriority,:userId,:isActive)", this)
    }

    static async getAllUserTodos(userId: string): Promise<TodosInterface[]> {
        const [results] = await pool.execute("SELECT * FROM `todos` WHERE `userId`=:userId ORDER BY `highPriority` DESC, `deadline` ASC", {
            userId,
        }) as NewTodoType;

        return results.map(todo => new TodosRecord(todo));
    }

    static async update(id: string, isActive: boolean | string): Promise<void> {
        await pool.execute("UPDATE `todos` SET `isActive`=:isActive WHERE `id`=:id", {
            id,
            isActive,
        })
    }

    static async deleteTodo(id: string): Promise<void> {
        await pool.execute("DELETE FROM `todos` WHERE `id`=:id", {
            id,
        })
    }
}