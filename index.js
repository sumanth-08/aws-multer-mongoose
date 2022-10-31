const express = require("express")
const mongoose = require("mongoose")
const mongoDB = "mongodb://127.0.0.1/my_database";
const routers = require("./app");
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }));

app.use("/", routers);

mongoose.connect(mongoDB, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
const con = mongoose.connection

con.on("open", () => {
    console.log("connected..")
})

app.listen(4000, () => {
    console.log("server is connected..")
})