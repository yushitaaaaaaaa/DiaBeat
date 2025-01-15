const Entry = require('../models/WorkoutModel')
const mongoose = require('mongoose')

const getEntries = async (req, res) => {
    const user_id = req.user._id;
    const { search } = req.query; 

    const query = { user_id };
    if (search) {
        query.title = { $regex: search, $options: 'i' };  
    }

    const entries = await Entry.find(query).sort({ createdAt: -1 });

    res.status(200).json(entries);
};


//get single entry
const getEntry=async(req,res)=>{
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such entry'})
    }

    const entry=await Entry.findById(id)

    if (!entry) {
        return res.status(404).json({error: 'No such entry'})
    }

    res.status(200).json(entry)
}



//create new entry
const createEntry = async (req, res) =>{
    const{title, load, reps}=req.body

    let emptyFields=[]

    if(!title){
        emptyFields.push('title')
    }
    if (!load){
        emptyFields.push('load')
    }
    if(!reps){
        emptyFields.push('reps')
    }
    if(emptyFields.length>0){
        return res.status(400).json({error: 'Please fill in all the fields', emptyFields})
    }

    //add doc to db
    try{
        const user_id=req.user._id
        const entry= await Entry.create({title, load, reps, user_id})
        res.status(200).json(entry)
    } catch(error){
        res.status(400).json({error: error.message})
    }
}

//delete a entry
const deleteEntry = async(req,res)=>{
    const{id}=req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such entry'})
    }

    const entry=await Entry.findOneAndDelete({_id: id})

    if (!entry) {
        return res.status(404).json({error: 'No such entry'})
    }
    res.status(200).json(entry)
}


//update a entry
const updateEntry = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such entry' });
    }

    
    const updateFields = { ...req.body };
    delete updateFields.user_id;  // Prevent updating the user_id field

    const entry = await Entry.findOneAndUpdate({ _id: id }, updateFields, { new: true });

    if (!entry) {
        return res.status(404).json({ error: 'No such entry' });
    }

    res.status(200).json(entry);
};




module.exports={
    getEntries,
    getEntry,
    createEntry,
    deleteEntry,
    updateEntry
}
