const express = require('express')
const cors = require('cors')
const signUpRouter = require('./routes/Signup.js')
const dashBoardRouter = require('./routes/dashBoard.js')
const userRouter = require('./routes/user.js')
const app = express()

app.use(express.json())
app.use(cors())
app.set(express.urlencoded({extended:true}))

app.use(signUpRouter)
app.use(dashBoardRouter)
app.use(userRouter)

app.listen(4000, () => {
    console.log('server 4000')
})