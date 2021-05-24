const express= require('express')
const Book= require('../models/book')
const auth= require('../middleware/auth')
const Task = require('c:/users/dmcut/onedrive/desktop/src/models/task')
const router= new express.Router()

//Add a book review.
router.post('/book', auth, async(req, res)=>{
    const book= new Book({
        ...req.body,
        owner: req.user._id
    })

    try{
        await book.save()
        res.status(201).send(book)
    }catch(e){
        res.status(400).send(e)
    }
})

//View all your book reviews.
router.get('/books', auth, async(req,res)=>{
    try{
        const books= await book.find({owner: req.user._id})
        res.send(books)
    }catch(e){
        res.status(500).send()
    }
})

//View a particular review.
router.get('/books/:id', auth, async(req, res)=>{
    const _id= req.params._id
    try{
        const book= await Book.findOne({_id, owner:req.user._id})
        if(!book){
            return res.status(404).send()
        }
        res.send(book)
    }catch(e){
        res.status(500).send()
    }
})

//Edit a review.
router.patch('/books/:id', auth, async(req,res)=>{
    const updates= Object.keys(req.body)
    const allowedUpdates= ['name', 'status', 'rating', 'review']
    const isValidOperation= updates.every((update)=>allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error:'Invalid update.'})
    }

    try{
        const book= await Book.findOne({_id: req.params.id, owner:req.user._id})
        if(!book){
            return res.status(400).send()
        }

        updates.forEach((update)=> book[update]= req.body[update])
        await book.save()
        res.send(book)
    }catch(e){
        res.status(400).send(e)
    }
})

//Delete a review.
router.delete('/books/:id', auth, async(req,res)=>{
    try{
        const book=await Book.findOneAndDelete({_id: req.params.id, owner: req.user._id})
        if(!book){
            res.status(400).send()
        }
        res.send(book)
    }catch(e){
        res.status(500).send()
    }
})

module.exports= router