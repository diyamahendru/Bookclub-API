const mongoose= require('mongoose')

const Book= mongoose.model('Book', {
    name:{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    },
    rating:{
        type: Number,
        max: 10,
        validate(value){
            if(value<0){
                throw new Error('Rating should be a positive number.')
            }
        }
    },
    review:{
        type: String
    },
    owner:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
})

module.exports= Book