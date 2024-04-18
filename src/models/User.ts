import mongoose from 'mongoose';

export default interface User {
    id: number,
    nom: string,
    mail: string,
    dateNaiss: string,
    password: string
}

export const UserSchema = new mongoose.Schema({
    nom: String,
    mail: String,
    dateNaiss: String,
    password: String
  });


