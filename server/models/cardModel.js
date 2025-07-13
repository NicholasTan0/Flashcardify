import mongoose from "mongoose";

const cardSchema = new mongoose.Schema({
    term: { type: String },
    definition: { type: String },
    termImg: { type: String, default: null },
    definitionImg: { type: String, default: null }
})

const cardModel = mongoose.models.card || mongoose.model("card", cardSchema);

export default cardModel;