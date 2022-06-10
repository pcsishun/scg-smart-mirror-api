// require("./connection/connection").connect();
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const fs = require('fs');
const axios = require('axios');

// const mockUserData = require("./model/mockUserData");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors()); 

const { PORT } = process.env
const port = process.env.PORT || PORT 


app.post("/haddlemodel", async (req, res) => {
    
    let result= []

    // เลือก path json ของ voice //
    const RawemotionVoice = fs.readFileSync("../version_api_post/sentiment.json");
    const RawemotionVideo = fs.readFileSync("../version_api_post/video_emotion.json");

    const emotionVoice = JSON.parse(RawemotionVoice);
    const emotionVideo = JSON.parse(RawemotionVideo);

    // ==== old version ==== //
    // let emotionVideo = fs.readFileSync("../AI_neural_network/scg-use-model-video/test_emotion.txt","utf8");
    // let emotionVocie = fs.readFileSync("../AI_neural_network/scg-use-model-voice/emotion_voice.txt","utf8");
   // ==== end old version ==== // 

    let userid = fs.readFileSync("./userid.txt","utf8");
    let username = fs.readFileSync("./username.txt","utf8");
    let email = fs.readFileSync("./email.txt","utf8");
    let phone = fs.readFileSync("./phone.txt", "utf8");
    let address =fs.readFileSync("./address.txt","utf8");
    // console.log("readFileSync")
 
    try{
        const payLoad = {
            // user data //
            uid:userid, 
            name:username, 
            email:email, 
            phone:phone, 
            address:address, 

            // voice data //
            voiceWord:emotionVoice.word,
            voiceScore:emotionVoice.sentiment_score,
            voiceMagnitude:emotionVoice.sentiment_magnitude,
            voiceMood:emotionVoice.feeling, 
            
            // video data //
            faceAnger:emotionVideo.anger,
            faceJoy:emotionVideo.joy,
            faceSurprise:emotionVideo.surprise,
            faceSorrow:emotionVideo.sorrow,
            faceMood:emotionVideo.highest_emotion
        }
        const headerConfig = {
            headers:{
                'Content-Type': 'application/json',
            }
        }
        
        // setting uri // 
        // console.log("await")
    
        axios.post("http://167.71.215.3:80/db/write",payLoad,headerConfig);
        
        // debug mode // 
        // result.push(payLoad)
        // production mode //

        // console.log("payLoad ==>", payLoad)
        // console.log("emotionVideo.highest_emotion ==>",emotionVideo.highest_emotion)

        result.push("Face emotion: " + emotionVideo.highest_emotion)
        res.send(result)
    }catch(err){
        result.push("fail to connecting to database!")
        res.send(result)
    }

})

app.get("/haddlemodelvoice", async (req, res) => {
    
    let result = []
    
    try{
        const RawemotionVoice = fs.readFileSync("../version_api_post/sentiment.json");
        const emotionVoice = JSON.parse(RawemotionVoice);
        const emotionFeel = emotionVoice.feeling;
 
        if(emotionFeel === undefined){
            // console.log("null")
            const nullDetect = "Hello User";
            result.push(nullDetect);
            res.send(result);

        }else{
            // console.log("none null ===> ", emotionVideo, emotionVoice)
            result.push("Voice emotion: "+ emotionFeel);
            res.send(result);
        }

    }catch(err){
        console.log(err);
        result.push("connecting to module...");
        res.send(result);
    }
})

app.post("/mirror_register", async (req, res) => {
    const {userid, username, email, phone, address} = req.body; 
    // console.log(userid, username, email, phone, address)

    try{
        
        fs.writeFileSync("./userid.txt", userid);   
        fs.writeFileSync("./username.txt", username);
        fs.writeFileSync("./email.txt", email);
        fs.writeFileSync("./phone.txt", phone);
        fs.writeFileSync("./address.txt", address);

        const replyResult = {
            isError: false, 
            text: "register complete"
        }
        
        res.send(replyResult);
    }catch(err){
        const replyResult = {
            isError: true,
            text: err
        }
        res.send(replyResult);
    }
})

// api manage parameter page //

app.get("/getparam", async (req, res) => {
    const isThreshold = fs.readFileSync("../version_api_post/my_threshold.json");
    res.send(isThreshold);
})

app.post("/changeparam", async (req, res) => {

    const { videoDuration, voiceDuration, voiceMin, voiceMax, isDefault }  = req.body;
    
    if(isDefault === true){
        const defaultParam = {
            video_duration:Number(videoDuration),
            voice_duration:Number(voiceDuration),
            voice_min_threshold: Number(voiceMin),
            voice_max_threshold:Number(voiceMax)
        }
        try{
            const convertToSting = JSON.stringify(defaultParam)
            fs.writeFileSync("../version_api_post/my_threshold.json", convertToSting);
        }catch(err){
            console.log(err);
        }
        
    }
    else{
        try{
            const defaultParam = {
                video_duration:Number(videoDuration),
                voice_duration:Number(voiceDuration),
                voice_min_threshold:Number(voiceMin),
                voice_max_threshold:Number(voiceMax)
            }

            // console.log("defaultParam ===> ",defaultParam);

            const convertToSting = JSON.stringify(defaultParam)
                fs.writeFileSync("../version_api_post/my_threshold.json", convertToSting);
        }catch(err){
            console.log(err)
        }
        
    }

})


app.listen(port, () => {
    console.log(`Server running on port ${port} ==> http://localhost:${port}`);
})
