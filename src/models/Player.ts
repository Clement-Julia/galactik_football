import mongoose, { Schema, Document } from 'mongoose';

export interface IPlayer extends Document {
    name: string;
    position: string;
    overallRating: number;
    nationalite: string;
}

const PlayerSchema: Schema = new Schema({
    name: { type: String, required: true },
    position: { type: String, required: true },
    overallRating: { type: Number, required: true },
    nationalite: { type: String, required: true }
});

export default mongoose.model<IPlayer>('Player', PlayerSchema);
