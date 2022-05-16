const express = require('express')
const cors = require('cors')
const router = require('./routes/Signup')
const app = express()

app.use(express.json())
app.use(cors())
app.set(express.urlencoded({extended:true}))

app.use(router)

app.listen(4000, () => {
    console.log('server 4000')
})