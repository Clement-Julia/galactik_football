import { Schema } from "mongoose";
import { ILeague } from "./League";

export interface ITeam { 
    name: string;
    league: ILeague[];
}

export const teamSchema = new Schema({
    name: {type: String, required: true},
    league: [{ type: Schema.Types.ObjectId, ref: 'League' }]
})