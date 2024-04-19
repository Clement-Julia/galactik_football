import { Schema } from "mongoose";

export interface ILeague {
    id: string;
    name: string;
    pays: string;
}

export const leagueSchema = new Schema({
    name: {type : String, required: true},
    pays: {type : String, required: true},
})