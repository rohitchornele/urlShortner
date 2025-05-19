import mongoose from "mongoose";

const urlSchema = new mongoose.Schema({
    shortCode: String,
    longUrl: String
})

export const URL = mongoose.model("shortUrl", urlSchema);