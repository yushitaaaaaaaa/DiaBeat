const Workout = require('../models/WorkoutModel')
const mongoose = require('mongoose')

const getEntries = async (req, res) => {
    const user_id = req.user._id;
    const { search } = req.query; 

    const query = { user_id };
    if (search) {
        query.title = { $regex: search, $options: 'i' };  
    }

    const workouts = await Workout.find(query).sort({ createdAt: -1 });

    res.status(200).json(workouts);
};


//get single workout
const getEntry=async(req,res)=>{
    const {id} = req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'})
    }

    const workout=await Workout.findById(id)

    if (!workout) {
        return res.status(404).json({error: 'No such workout'})
    }

    res.status(200).json(workout)
}



//create new workout
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
        const workout= await Workout.create({title, load, reps, user_id})
        res.status(200).json(workout)
    } catch(error){
        res.status(400).json({error: error.message})
    }
}

//delete a workout
const deleteEntry = async(req,res)=>{
    const{id}=req.params

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'No such workout'})
    }

    const workout=await Workout.findOneAndDelete({_id: id})

    if (!workout) {
        return res.status(404).json({error: 'No such workout'})
    }
    res.status(200).json(workout)
}


//update a workout
const updateEntry = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'No such workout' });
    }

    
    const updateFields = { ...req.body };
    delete updateFields.user_id;  // Prevent updating the user_id field

    const workout = await Workout.findOneAndUpdate({ _id: id }, updateFields, { new: true });

    if (!workout) {
        return res.status(404).json({ error: 'No such workout' });
    }

    res.status(200).json(workout);
};




module.exports={
    getEntries,
    getEntry,
    createEntry,
    deleteEntry,
    updateEntry
}
