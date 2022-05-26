const mongoose = require("mongoose"); 


const mockUserData = new mongoose.Schema({
    userid: {type:String, default:null},
    cameraEmotion: {type:String, default:null},
    voiceEmotion:{type:String, default:null}
})


module.exports = mongoose.model("user_emotion", mockUserData);