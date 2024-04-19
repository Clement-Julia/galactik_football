import { Schema } from "mongoose";
import { ITournament } from "./Tournament";
import { ITeam } from "./Team";
import { IScore } from "./Score";

export interface IMatch {
    id: string;
    team1: ITeam;
    team2: ITeam;
    score1: IScore[];
    score2: IScore[];
    summary: string;
    tournament: ITournament;
}

export const matchSchema = new Schema({
    team1: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    team2: { type: Schema.Types.ObjectId, ref: 'Team', required: true },
    score1: [{ type: Schema.Types.ObjectId, ref: 'Score' }],
    score2: [{ type: Schema.Types.ObjectId, ref: 'Score' }],
    summary: { type: String },
    tournament: { type: Schema.Types.ObjectId, ref: 'Tournament', required: true }
})