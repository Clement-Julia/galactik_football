import mongoose, {Schema} from 'mongoose';

export interface IUser {
    id: number,
    nom: string,
    mail: string,
    dateNaiss: string,
    password: string,
    budget: number,
    isAdmin: boolean,
}

export const userSchema = new Schema({
    nom: String,
    mail: String,
    dateNaiss: String,
    password: String,
    budget: Number,
    isAdmin: Boolean,
});
