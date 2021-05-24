const mongoose= require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/bookclub', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})

//D:/db/mongoDB/bin/mongod.exe --dbpath=D:/db/mongoDB-data 