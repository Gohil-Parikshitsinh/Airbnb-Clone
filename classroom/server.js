const express = require("express");
const app = express();
const users = require("./routes/user.js");
const posts = require("./routes/posts.js");

app.get("/",(req,res)=>{
    res.send("Hi, i am root");
})


app.use("/users",users)
app.use("/posts",posts)
app.listen(3000, ()=>{
    console.log("Server is listening to 3000");
})