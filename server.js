const express = require("express")
const mongoose  = require("mongoose")
const Article = require("./models/model")
const Router = require("./routes/routes")

const app = express()
const Port = 3000


const dbURL = 'mongodb+srv://list_user:user123@cluster0.f88bnq0.mongodb.net/LogSignBase?retryWrites=true&w=majority'
mongoose.connect(dbURL)
    .then((result) =>{
        app.listen(Port)
        console.log("server started")
    })
    .catch((e) => console.log(e))


app.set("view engine", "ejs")
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get("/", (req, res) => {
    res.render('routes/index')
})


app.use('/routes', Router)