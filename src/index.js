const express= require('express')
const userRouter= require('./routers/user')
const bookRouter= require('./routers/books')
require('./db/mongoose')


const app= express()
const port= 3000

app.use(express.json())
app.use(userRouter)
app.use(bookRouter)


app.listen(port, ()=>{
    console.log('Server is up on port'+port)
})

