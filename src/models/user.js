const mongoose= require('mongoose')
const validator= require('validator')
const bcrypt= require('bcryptjs')
const jwt= require('jsonwebtoken')

const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true,
        triem: true
    },
    email:{
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is not valid.')
            }
        }
    },
    password:{
        type: String,
        minlength: 8,
        trim: true,
        required: true,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Weak Password. Choose another.')
            }
        }
    },
    friends:[{
        friend:{
            type: String
        }
    }],
    tokens:[{
        token:{
            type: String,
            required: true
        }
    }]
})

//Hiding the important information before sending the response.
userSchema.methods.toJSON= function(){
    const user= this
    const userObject= user.toObject()
    
    delete userObject.password
    delete userObject.tokens

    return userObject
}

//Find the user by the email and password.
userSchema.statics.findByCredentials= async(email, password)=>{
    const user= await User.findOne({email})

    if(!user){
        throw new Error('Id does not exist.')
    }

    const match= await bcrypt.compare(password, user.password)
    if(!match){
        throw new Error('Wrong password. Unable to login.')
    }
    return user
}

//To generate a token every time someone logs in.
userSchema.methods.generateToken= async function(){
    const user= this
    const token= jwt.sign({_id: user._id.toString()}, 'wholesomegigachad')
    //console.log(token)

    user.tokens= user.tokens.concat({token})
    await user.save()

    return token
}

//Hashing the password before it is saved in the database.
userSchema.pre('save', async function(next){
    const user= this
    if(user.isModified('password')){
        user.password=await bcrypt.hash(user.password, 8)
    }
})

//userSchema.pre('remove')


const User= mongoose.model('Member', userSchema)

module.exports= User