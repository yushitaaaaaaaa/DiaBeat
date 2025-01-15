const express = require('express')
const {
    createEntry, 
    getEntries,
    getEntry,
    deleteEntry, 
    updateEntry
} = require('../controllers/entryController')
const requireAuth = require('../middleware/requireAuth')



const router=express.Router()

//require auth for all workout routes
router.use(requireAuth)

router.get('/', getEntries)

router.get('/:id',getEntry)

router.post('/', createEntry)

router.delete('/:id', deleteEntry)

router.patch('/:id', updateEntry)

module.exports=router 
