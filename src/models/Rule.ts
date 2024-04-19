import { Schema } from "mongoose";

export interface IRule {
    id: string;
    name: string;
    description: string;
}

export const ruleSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true }
})