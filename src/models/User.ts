import mongoose, {Schema} from 'mongoose';

export interface IUser {
    id: number,
    nom: string,
    mail: string,
    dateNaiss: string,
    password: string,
    budget: number
}

const UserSchema = new Schema({
    nom: String,
    mail: String,
    dateNaiss: String,
    password: String,
    budget: Number
});

export default mongoose.model<IUser>('User', UserSchema);