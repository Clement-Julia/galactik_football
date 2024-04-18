import { Schema } from "mongoose";
import { IPlayer } from "./Player";

export interface IScore {
    player: IPlayer;
    dateScore: Date;
}

export const scoreSchema = new Schema({
    player: { type: Schema.Types.ObjectId, ref: 'Player', required: true},
    dateScore: { type : Date, required: true}
})