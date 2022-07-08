import express from 'express';
import cors from 'cors';
import 'express-async-errors';
import {config} from "./config/config";
import {handleError} from "./utils/errors";
import {userRouter} from "./routers/user.router";
import {NotesRouter} from "./routers/notes.router";


const app = express();
app.use(cors({
    origin: config.corsOrigin,
}));

app.use(express.json());
app.use('/', userRouter);
app.use('/notes', NotesRouter);

app.use(handleError);
app.listen(3001, '0.0.0.0', () => console.log('Listening on http://localhost:3001'));