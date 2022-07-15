import {Router} from "express";
import {TodosRecord} from "../records/todos.record";

export const TodosRouter = Router()

    .post('/:id', async (req, res) => {
        const newTodo = await new TodosRecord({
            ...req.body,
            userId: req.params.id,
            isActive: true,
        });
        await newTodo.insertTodo();
        res.json({message: "added"})
    })
    .get('/:userId', async (req, res) => {
        const todos = await TodosRecord.getAllUserTodos(req.params.userId);
        res.json(todos);
    })

    .patch('/:userId', async (req, res) => {
        await TodosRecord.update(req.params.userId, req.body.isActive);
        res.json({message: "updated"})
    })

    .delete('/:todoId', async (req, res) => {
        await TodosRecord.deleteTodo(req.params.todoId);
        res.json({message: 'deleted'})
    })

