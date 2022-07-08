import {Router} from "express";
import {NotesRecord} from "../records/notes.record";

export const NotesRouter = Router()

    .get('/', async (req, res) => {
        const notes = await NotesRecord.getAllUserNotes('6169e714-65cc-41e8-b6aa-709df1773cb4');
        console.log(notes);
        res.json(notes);
    })

    .get('/one', async (req, res) => {
        const note = await NotesRecord.getOneNote('fbaf63c1-fe30-11ec-bf98-d45d6482d051');
        console.log(note);
        res.json({message: 'ok'})
    })

    .delete('/', async (req, res) => {
        await NotesRecord.deleteNote("64c561ec-fe2c-11ec-bf98-d45d6482d051");
        res.json({message: 'ok'});
    })