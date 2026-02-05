require('dotenv').config();

const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require('./routes/auth-routes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

//connect to database
mongoose.connect(process.env.MONGODB_URI)
.then(()=>console.log("mongodb is successfully connected"))
.catch(e=>console.error("An Error has occured : ",e))

app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'http://localhost:3000'], //frontend urls
    credentials: true
}));


app.use(express.json());

//check if the endpoint hits

app.use((req,res,next)=>{
    console.log(`Recieved ${req.method} request to ${req.url}`);
    next();
});

app.use('/auth', authRoutes)



//starts the server
app.listen(PORT, ()=> {
    console.log(`server is running on ${PORT}`) 
})

