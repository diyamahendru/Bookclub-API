const express= require('express')
const userRouter= require('./routers/user')
require('./db/mongoose')


const app= express()
const port= 3000

app.use(express.json())
app.use(userRouter)

app.listen(port, ()=>{
    console.log('Server is up on port'+port)
})

