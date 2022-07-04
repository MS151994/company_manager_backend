export interface NewUser extends Omit<UserInterface, 'id'> {
    id?: string;
}

export interface UserInterface {
    id: string;
    name: string;
    password: string;
    isAdmin: boolean;
    createdAt: Date;
}

