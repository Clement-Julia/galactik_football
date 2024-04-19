import { Schema } from "mongoose";
import { ILeague } from "./League";
import { IUser } from "./User";
import { IPlayer } from "./Player";

export interface ITeam { 
    id: string;
    name: string;
    default: boolean;
    user: IUser;
    players: IPlayer[];
    league: ILeague;
}

export const teamSchema = new Schema({
    name: {type: String, required: true},
    default: {type: Boolean, required: true},
    user: { type: Schema.Types.ObjectId, ref: 'User'},
    player: [{ type: Schema.Types.ObjectId, ref: 'Player' }],
    league: { type: Schema.Types.ObjectId, ref: 'League' }
})