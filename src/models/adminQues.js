const mongoose = require("mongoose");

const questionSchema = mongoose.Schema({
    title: {
        type: String,
        trim: true
    },
    ques: {
        type: String,
        trim: true
    },
    ans: {
        type: String,
        trim: true
    },
    Image: {
        data: Buffer,
        contentType: String
    },
    url: {
        type:String,
        trim: true
    },
    Subject: {
        type: Number,
    },
    topic: {
        type: String,
    },
    date:{
        type:Date,
        default:Date.now()
    }
});




const question = mongoose.model("Question", questionSchema);

module.exports =question;