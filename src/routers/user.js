const express= require('express')
const User= require('../models/user')
const auth= require('../middleware/auth')

const router= new express.Router()

//Sign up for a new user.
router.post('/users/signup', async(req, res)=>{
    const user= new User(req.body)
    try{
        await user.save()
        const token= await user.generateToken()
        res.status(201).send({user,token})
    }catch(e){
        res.status(401).send(e)
        console.log(e)
    }
})

//Log in for a user.
router.post('/users/login', async(req,res)=>{
    try{
        const user= await User.findByCredentials(req.body.email, req.body.password)
        const token= await user.generateToken()
        res.send({user, token})
    }catch(e){
        console.log(e)
        res.status(400).send()
    }
})

//Log out for a user.
router.post('/users/logout', auth, async(req,res)=>{
    try{
        req.user.tokens= req.user.tokens.filter((token)=>{
            return token.token!== req.token
        })
        await req.user.save()
        res.send()
    }catch(e){
        res.status(500).send()
    }
})

//See your personal details.
router.get('/users/me', auth, async(req, res)=>{
    res.send(req.user)
})

//Change personal details.
router.patch('/users/me', auth, async(req, res)=>{
    const updates= Object.keys(req.body)
    const allowedUpdates= ['name', 'email', 'password']
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update))

    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'})
    }

    try{
        updates.forEach((update)=> req.user[update]= req.body[update])
        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(400).send(e)
    }
})

//Delete your account.
router.delete('/users/me', auth, async(req,res)=>{
    try{
        await req.user.remove()
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})

//Add friend.
router.post('/users/me/addfriend/:id', auth, async(req, res)=>{
    try{
        const _id= req.params.id
    req.user.friends = req.user.friends.addToSet({ _id })
    await req.user.save()
    res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})


//Remove friend.
router.post('/users/me/removefriend/:id', auth, async (req, res)=>{
    try{
        const _id= req.params.id
        req.user.friends= req.user.friends.filter((friend)=>{
            return friend.friend !== req.friend
        })

        await req.user.save()
        res.send(req.user)
    }catch(e){
        res.status(500).send()
    }
})

module.exports= router