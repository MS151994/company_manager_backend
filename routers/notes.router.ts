import {Router} from "express";
import {NotesRecord} from "../records/notes.record";

export const NotesRouter = Router()

    .get('/:id', async (req, res) => {
        const notes = await NotesRecord.getAllUserNotes(req.params.id);
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