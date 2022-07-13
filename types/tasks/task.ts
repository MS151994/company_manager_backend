export interface NewTask extends Omit<TaskInterface, "id"> {
    id?: string;
}

export interface TaskInterface {
    id: string;
    title: string
    text: string;
    nip: number;
    telNumber: number;
    isDone: boolean | string;
    createdAt: Date;
    deadline: Date;
    userId: string | null;
    status: string;
}