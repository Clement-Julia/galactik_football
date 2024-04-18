import { Schema } from "mongoose";

export interface ILeague { 
    name: string;
    pays: string;
}

export const leagueSchema = new Schema({
    name: {type : String, required: true},
    pays: {type : String, required: true},
})