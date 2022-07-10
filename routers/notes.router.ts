import {Router} from "express";
import {NotesRecord} from "../records/notes.record";

export const NotesRouter = Router()

    .get('/:id', async (req, res) => {
        const notes = await NotesRecord.getAllUserNotes(req.params.id);
        res.json(notes);
    })

    .post('/', async (req, res) => {
        const newNote = await new NotesRecord({
            ...req.body,
            createdAt: new Date(),
        });
        await newNote.insertNote();
        res.json({message: "added"});
    })

    .patch('/one/:id', async (req, res) => {
        await NotesRecord.update(req.params.id, req.body.isImportant);
        res.json({message: 'ok'});
    })
    .put('/edit/:id', async (req, res) => {
        const note = await NotesRecord.getOneNote(req.params.id);
        const updateNote = await new NotesRecord({
            ...note,
            title: req.body.title,
            text: req.body.text,
            isImportant: req.body.isImportant,
        })
       await updateNote.updateAll()
        res.json({message: 'ok'})
    })

    .delete('/:id', async (req, res) => {
        await NotesRecord.deleteNote(req.params.id);
        res.json({message: 'ok'});
    })
