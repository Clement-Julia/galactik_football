import mongoose, { Schema, Document } from 'mongoose';

export interface IUserPlayer extends Document {
    userId: string;
    playerId: string;
}

export const userPlayerSchema: Schema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    playerId: { type: Schema.Types.ObjectId, ref: 'Player', required: true }
});