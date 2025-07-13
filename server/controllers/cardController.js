import cardModel from '../models/cardModel.js'
import {v2 as cloudinary} from 'cloudinary';

const addCard = async (req, res) => {
    try {
        const { term, definition } = req.body; 

        const termImg = req.files.termImg && req.files.termImg[0];
        const definitionImg = req.files.definitionImg && req.files.definitionImg[0];

        let termImgURL = null;
        if(termImg){
            let termImgUpload = await cloudinary.uploader.upload(termImg.path, {resource_type: 'image'});
            termImgURL = termImgUpload.secure_url;
        }

        let definitionImgURL = null;
        if(definitionImg){
            let definitionImgUpload = await cloudinary.uploader.upload(definitionImg.path, {resource_type: 'image'});
            definitionImgURL = definitionImgUpload.secure_url;
        }
        
        const newCard = new cardModel({
            term,
            definition,
            termImg: termImgURL,
            definitionImg: definitionImgURL,
        })

        const card = await newCard.save();
        res.json({success: true, card});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

const removeCard = async (req, res) => {
    try {
        // const card = await cardModel.findById(req.body.id);
        // if(!card) return res.json({ success: false, message: "Card not found" });
        await cardModel.findByIdAndDelete(req.params.id);
        res.json({ success: true, message: "Card removed" });
    } catch (error) {
        console.error(error);
        res.json({success: false, message: error.message});
    }
}

const updateCard = async (req, res) => {
    try {
        const { term, definition } = req.body; 

        const termImg = req.files.termImg && req.files.termImg[0];
        const definitionImg = req.files.definitionImg && req.files.definitionImg[0];

        const toUpdate = {};

        if(term) toUpdate.term = term;
        if(definition) toUpdate.definition = definition;

        let termImgURL = null;
        if(termImg){
            let termImgUpload = await cloudinary.uploader.upload(termImg.path, {resource_type: 'image'});
            termImgURL = termImgUpload.secure_url;
            toUpdate.termImg = termImgURL;
        }

        let definitionImgURL = null;
        if(definitionImg){
            let definitionImgUpload = await cloudinary.uploader.upload(definitionImg.path, {resource_type: 'image'});
            definitionImgURL = definitionImgUpload.secure_url;
            toUpdate.definitionImg = definitionImgURL;
        }

        const updatedCard = await cardModel.findByIdAndUpdate(req.params.id, 
            { $set: toUpdate },
            { new: true }
        );
        res.json({success: true, card: updatedCard});
    } catch (error) {
        console.log(error);
        res.json({success: false, message: error.message});
    }
}

export {addCard, removeCard, updateCard }