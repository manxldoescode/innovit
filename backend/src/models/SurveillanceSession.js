const mongoose = require('mongoose');

const SurveillanceSessionSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User",
        required : true,
        index : true
    },

    youtubeUrl : {
        type : String,
        required : true,
        trim : true
    },

    interval : {
        type : Number,
        required : true,
        min : 1
    },

    prompt :{
        type : String,
        required : true
    },

    status :{
        type : String,
        enum : ["running", "stopped", "failed"],
        default : "running"
    },

    startedAt : {
        type : Date,
        default : Date.now
    },

    stoppedAt : {
        type : Date
    }
}, { timestamps : true}
);

module.exports = mongoose.model("SurveillanceSession", SurveillanceSessionSchema);