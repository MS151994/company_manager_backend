export interface NewNote extends Omit<NotesInterface, 'id'> {
    id?: string;
}

export interface NotesInterface {
    id: string;
    title: string;
    text: string;
    createdAt: Date;
    userId: string | null;
    isImportant: boolean;
}