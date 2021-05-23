const mongoose= require('mongoose')

mongoose.connect('mongodb://127.0.0.1:27017/bookclub', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
}).then(data=>{
    console.log('Connected')
}).catch(data=>{
    console.log('Not COneected')
})

//C:/Users/dmcut/mongoDB/bin/mongod.exe --dbpath=C:/Users/dmcut/mongoDB-data