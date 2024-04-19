import { Schema } from "mongoose";
import { ITeam } from "./Team";
import { IRule } from "./Rule";
import { ILeague } from "./League";

export interface ITournament {
    id: string;
    name: string; 
    teams: ITeam[]; 
    rules: IRule[];
    winner: ITeam;
    league: ILeague;
}

export const tournamentSchema = new Schema({
    name: {type: String, required: true},
    teams: [{ type: Schema.Types.ObjectId, ref: 'Team', required: true}],
    rules: [{ type: Schema.Types.ObjectId, ref: 'Rule' }],
    winner: { type: Schema.Types.ObjectId, ref: 'Team' },
    league: { type: Schema.Types.ObjectId, ref: 'League', required: true }
})