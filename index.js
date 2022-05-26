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


app.get("/haddlemodel", async (req, res) => {
    
    let result= []

    // เลือก path json ของ voice //
    const emotionVoice = require("../AI_neural_network/scg-use-model-voice/sentiment.json");

    let emotionVideo = fs.readFileSync("../AI_neural_network/scg-use-model-video/test_emotion.txt","utf8");
    // let emotionVocie = fs.readFileSync("../AI_neural_network/scg-use-model-voice/emotion_voice.txt","utf8");
    let userid = fs.readFileSync("./userid.txt","utf8");
    let username = fs.readFileSync("./username.txt","utf8");
    let email = fs.readFileSync("./email.txt","utf8");
    let phone = fs.readFileSync("./phone.txt", "utf8");
    let address =fs.readFileSync("./address.txt","utf8");
    // console.log("readFileSync")
    // console.log("sending ==>", emotionVideo, emotionVocie, userid, username, email,  phone, address)



    try{
        const payLoad = {
            uid:userid, 
            name:username, 
            email:email, 
            phone:phone, 
            address:address, 
            voiceWord:emotionVoice.word,
            voiceScore:emotionVoice.sentiment_score,
            voiceMagnitude:emotionVoice.sentiment_magnitude,
            voiceMood:emotionVoice.feeling, 
            faceMood:emotionVideo
        }
        const headerConfig = {
            headers:{
                'Content-Type': 'application/json',
            }
        }
        
        // setting uri // 
        // console.log("await")
    
        axios.post("http://167.71.215.3:80/db/write",payLoad,headerConfig)
    
        result.push(emotionVideo)
        res.send(result)
    }catch(err){
        result.push("connecting to module")
        res.send(result)
    }

})

app.get("/haddlemodelvoice", async (req, res) => {
    
    let result = []
    
    try{
        const emotionVoice = require("../AI_neural_network/scg-use-model-voice/sentiment.json");
        console.log("emotionVoice ==>", emotionVoice);
        const emotionFeel = emotionVoice.feeling;
        // let emotionVoice = fs.readFileSync("../AI_neural_network/scg-use-model-voice/emotion_voice.txt","utf8");
    
        // console.log("sending ===> ",emotionVideo.length, emotionVoice.length, emotionVideo, emotionVoice)
        // const emptyfill = "null"
        if(emotionFeel === undefined){
            // console.log("null")
            const nullDetect = "Hello User";
            result.push(nullDetect);
            res.send(result);
        }else{
            // console.log("none null ===> ", emotionVideo, emotionVoice)
            result.push(emotionFeel);
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
    console.log(userid, username, email, phone, address)

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


app.get("/testing", (req, res) => {
    console.log("ok")
    let emotionVideo = fs.readFileSync("../AI_neural_network/scg-use-model-video/test_emotion.txt","utf8");
    let emotionVocie = fs.readFileSync("../AI_neural_network/scg-use-model-voice/emotion_voice.txt","utf8");
    let userid = fs.readFileSync("./userid.txt","utf8");
    let username = fs.readFileSync("./username.txt","utf8");
    let email = fs.readFileSync("./email.txt","utf8");
    let phone = fs.readFileSync("./phone.txt", "utf8");
    let address =fs.readFileSync("./address.txt","utf8");
    console.log("readFileSync")
    console.log("sending ==>", emotionVideo, emotionVocie, userid, username, email,  phone, address)

    const payLoad = {
        uid:userid, 
        name:username, 
        email:email, 
        phone:phone, 
        address:address, 
        voiceMood:emotionVocie, 
        faceMood:emotionVideo
    }
    const headerConfig = {
        headers:{
            'Content-Type': 'application/json',
        }
    }
    
    // setting uri // 
    // console.log("await")

    axios.post("http://localhost:80/db/write",payLoad,headerConfig).
    then(response => {
        console.log("result", response.data);
    });

    res.send(emotionVideo)
})



app.listen(port, () => {
    console.log(`Server running on port ${port} ==> http://localhost:${port}`);
})
