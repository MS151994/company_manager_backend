export interface NewTodo extends Omit<TodosInterface, 'id'> {
    id?: string;
}

export interface TodosInterface {
    id: string;
    title: string;
    text: string;
    createdAt: Date;
    deadline: Date;
    highPriority: boolean | string;
    userId: string;
    isActive: boolean | string;
}