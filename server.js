const express = require("express");
const app = express();
const Joi = require("joi");
app.use(express.static("public"));
app.use(express.json());
const mongoose = require("mongoose");

mongoose.connect("mongodb://localhost/songs", {useUnifiedTopology:true, useNewUrlParser:true})
    .then(()=>console.log("connected to mongodb"))
    .catch(err=>console.error("couldnt connect to mongodb", err));

const songSchema = new mongoose.Schema({
    title:String,
    artist:String,
    album:String,
    year:String,
    genre:String,
    writers:Array
});

const Song = mongoose.model('Song',songSchema);

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

app.get('/api/songs', (req,res)=>{
    getSongs(res);
});

async function getSongs(res){
    const songs = await Song.find();
    console.log(songs);
    res.send(songs);
}

app.get('/api/songs/:id',(req,res)=>{
    getSong(req.params.id, res);
});

async function getSong(id, res){
    const song = await Song.findOne({_id:id});
    console.log(song);
    res.send(song);
}

app.post('/api/songs', (req,res)=>{
    const result = validateSong(req.body);

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    const song = new Song({
        title:req.body.title,
        artist:req.body.artist,
        album:req.body.album,
        year:req.body.year,
        genre:req.body.genre,
        writers:req.body.writers
    });
    createSong(song,res);
});

async function createSong(song, res) {
    const result = await song.save();
    console.log(result);
    res.send(song);
}

app.put('/api/songs/:id',(req,res)=>{
    const result = validateSong(req.body);

    if(result.error){
        res.status(400).send(result.error.details[0].message);
        return;
    }
    updateSong(res, req.params.id, req.body.title, req.body.artist, req.body.album, req.body.year, req.body.genre, req.body.writers);
});

async function updateSong(res, id, title, artist, album, year, genre, writers){
    const result = await Song.updateOne({_id:id},{
        $set:{
            title:title,
            artist:artist,
            album:album,
            year:year,
            genre:genre,
            writers:writers
        }
    })
    res.send(result);
}

app.delete('/api/songs/:id',(req,res)=>{
    removeSong(res,req.params.id);
});

async function removeSong(res,id){
    const song = await Song.findByIdAndRemove(id);
    res.send(song);
}

function validateSong(song){
    const schema = {
        title:Joi.string().min(3).required(),
        artist:Joi.string().min(3).required(),
        album:Joi.string().min(3).required(),
        year:Joi.string().min(4).required(),
        genre:Joi.string().min(3).required(),
        writers:Joi.string().min(3).required()
    };
    return Joi.validate(song,schema);
}

app.listen(3000, ()=> {
    console.log("listening on port 3000");
});