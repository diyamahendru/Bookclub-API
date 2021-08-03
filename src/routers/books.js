const express= require('express')
const Book= require('../models/book')
const User= require('../models/user')
const auth= require('../middleware/auth')
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
        await req.user.populate('books').execPopulate()
        res.send(req.user.books)
    }catch(e){
        res.status(500).send()
    }
})

//View a particular review.
router.get('/books/:id', auth, async(req, res)=>{
    const _id= req.params.id
    try{
        const book= await Book.findOne({_id})
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

//View timeline reviews.
router.get('/timeline/all', auth, async(req,res)=>{
    try{
        //The Promise.all() method takes an iterable of promises as an input, and returns a single Promise that resolves 
        //to an array of the results of the input promises.
        const userReviews = await Book.find({owner:req.user._id})
        const friendReviews= await Promise.all(req.user.friends.map((friendID)=>{
            return Book.find({owner:friendID});
        })
    );
    res.send(userReviews.concat(...friendReviews))
    }catch(e){
        res.status(500).send()
    }
})

module.exports= router