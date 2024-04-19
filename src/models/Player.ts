import { Schema } from "mongoose";
import { ITeam } from "./Team";

export interface IPlayer {
    id: string;
    name: string;
    age: number;
    nationality: string;
    position: string;
    overallRating: number;
    team: ITeam;
}

export const playerSchema = new Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    nationality: { type: String, required: true },
    position: { type: String, required: true },
    overallRating: { type: Number, required: true },
    team: { type: Schema.Types.ObjectId, ref: 'Team', required: true }
})