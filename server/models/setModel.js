import mongoose from "mongoose";

const setSchema = new mongoose.Schema({
    cards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "card"
    }],
    title: { type: String, default: 'Untitled Set', required: true },
    diagram: { type: String, default: null }
})

const setModel = mongoose.models.set || mongoose.model("set", setSchema);

export default setModel;