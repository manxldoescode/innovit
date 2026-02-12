const mongoose = require('mongoose');

const SurveillanceLogSchema = new mongoose.Schema({
    session : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "SurveillanceSession",
        required : true,
        index : true 
    },

    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
        index : true
    },

    imagePath : {
        type : String,
        required : true    
    },

    aiResponse : {
        type : String,
        required : true
    },

    snippet : {
        type : String
    },

    timestamps : {
        type : Date,
        default : Date.now
    }
 
}, {timestamps : true}

);


module.exports = mongoose.model("SurveillanceLog", SurveillanceLogSchema);