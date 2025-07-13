import setModel from '../models/setModel.js';
import cardModel from '../models/cardModel.js';
import { v2 as cloudinary } from 'cloudinary';

// function for add set
const addSet = async (req, res) => {
    try {
        const { cards, title } = req.body; 
        let diagramURL = null;
        const diagram = req.file;
        if(diagram){
            let diagramUpload = await cloudinary.uploader.upload(diagram.path, {resource_type: 'image'});
            diagramURL = diagramUpload.secure_url;
        }
        
        const newSet = new setModel({
            cards: JSON.parse(cards),
            title,
            diagram: diagramURL,
        })

        const set = await newSet.save();
        res.status(201).json({success: true, set});
    } catch (error) {
        console.log(error);
        res.status(400).json({success: false, message: error.message});
    }
}

// function for remove set
const removeSet = async (req, res) => {
    try {
        const set = await setModel.findById(req.params.id);
        if(!set) return res.status(404).json({success: false, message: "Set not found"});
        await cardModel.deleteMany({ _id: { $in: set.cards } }); 
        await setModel.findByIdAndDelete(req.params.id);
        res.status(204).json({success: true, message: "Set removed"});
    } catch (error) {
        console.error(error);
        res.status(400).json({success: false, message: error.message});
    }
}

// function for getting all sets
const listSets = async (req, res) => {
    try {
        const sets = await setModel.find({});
        res.status(200).json({ success: true, sets});
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message});
    }
}

// function for getting a single set
const singleSet = async (req, res) => {
    try {
        const { id } = req.body;
        const set = await setModel.findById(id).populate('cards');
        res.status(200).json({ success: true, set })
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message});
    }
}

const pushSet = async (req, res) => {
    try {
        const cardIds = req.body.cardIds;
        const updateResponse = await setModel.updateOne({ _id: req.params.id },
            { $push: { cards: { $each: cardIds } } }
        )
        res.status(200).json({ success: true, message: `Pushed ${updateResponse.modifiedCount} document(s).` });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message});
    }
}

const pullSet = async (req, res) => {
    try {
        const cardIds = req.body.cardIds;
        const updateResponse = await setModel.updateOne({ _id: req.params.id },
            { $pull: { cards: { $in: cardIds }} }
        )
        if(updateResponse.matchedCount > 0 && updateResponse.modifiedCount > 0){
            const deleteResponse = await cardModel.deleteMany(
                { _id: { $in: cardIds } }
            )
            res.status(200).json({ success: true, message: `Document found, ${deleteResponse.deletedCount} deletion(s).`});
        }
        else if(updateResponse.matchedCount > 0 && updateResponse.modifiedCount === 0){
            res.status(400).json({ success: false, message: "Document found, no changes made."});
        }
        else res.status(400).json({ success: false, message: "No document found."});
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message});
    }
}

const updateSet = async (req, res) => {
    try {
        const { title, diagram, cards } = req.body;
        const toUpdate = {};

        if(title) toUpdate.title = title;
        
        let diagramURL = null;
        if(diagram){
            let diagramUpload = await cloudinary.uploader.upload(termImg.path, {resource_type: 'image'});
            diagramURL = diagramUpload.secure_url;
            toUpdate.diagram = diagramURL;
        }

        if(cards) toUpdate.cards = JSON.parse(cards);

        if(Object.keys(toUpdate).length > 0){
            const updatedSet = await setModel.findByIdAndUpdate(req.params.id,
                { $set: toUpdate },
                { new: true}
            )
            res.status(200).json({ success: true, set: updatedSet });
        }
        else res.status(400).json({ success: false, message: "Nothing was changed" });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, message: error.message});
    }
}

export {addSet, removeSet, listSets, singleSet, pushSet, pullSet, updateSet }