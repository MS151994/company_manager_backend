import {NewNote, NotesInterface} from "../types";
import {ValidationError} from "../utils/errors";
import {pool} from "../utils/db";
import {FieldPacket} from "mysql2";
import {v4 as uuid} from 'uuid';

type NewNotesType = [NotesInterface[], FieldPacket[]]

export class NotesRecord implements NotesInterface {
    id: string;
    title: string;
    text: string;
    createdAt: Date;
    userId: string | null;
    isImportant: boolean;

    constructor(obj: NewNote) {
        if (!obj.title || obj.title.length > 30) {
            throw new ValidationError('Title cannot be empty and exceed 30 characters')
        }
        if (obj.text.length > 1000) {
            throw  new ValidationError('Note text length max 1000 characters')
        }

        this.id = obj.id;
        this.title = obj.title;
        this.text = obj.text;
        this.createdAt = obj.createdAt;
        this.userId = obj.userId;
        this.isImportant = obj.isImportant;
    }

    async insertNote(): Promise<void> {
        if (!this.id) {
            this.id = uuid();
        } else {
            throw new ValidationError('Cannot insert something that is already inserted!')
        }
        await pool.execute("INSERT INTO `notes` (`id`,`title`,`text`,`userId`,`isImportant`)VALUES(:id,:title,:text,:userId,:isImportant)", this)
    }

    static async getAllUserNotes(userId: string): Promise<NotesInterface[]> {
        const [results] = await pool.execute("SELECT * FROM `notes` WHERE `userId`=:userId", {
            userId,
        }) as NewNotesType;
        return results.map(note => new NotesRecord(note));
    }

    static async getOneNote(id: string): Promise<NotesInterface> {
        const [result] = await pool.execute("SELECT * FROM `notes` WHERE `id`=:id", {
            id,
        }) as NewNotesType;
        return result.length === 0 ? null : new NotesRecord(result[0]);
    }

    static async update(id: string, isImportant: string): Promise<void> {
        await pool.execute("UPDATE `notes` SET `isImportant`=:isImportant WHERE  `id`=:id", {
            id,
            isImportant,
        });
    }

    async updateAll(): Promise<void> {
        await pool.execute("UPDATE `notes` SET `title`=:title,`text`=:text, `isImportant`=:isImportant WHERE`id`=:id", this);
    }

    static async deleteNote(id: string): Promise<void> {
        await pool.execute("DELETE FROM `notes` WHERE `id`=:id", {
            id,
        })
    }

}