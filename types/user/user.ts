export interface NewUser extends Omit<UserInterface, 'id'> {
    id?: string;
}

export interface UserInterface {
    id: string;
    name: string;
    password: string;
    createdAt: Date;
    ivHex: string;
    userRole: string;
    userStatus: string;
}

