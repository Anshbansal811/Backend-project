import fetch from 'node-fetch';
import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';

const app=express()
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())



mongoose.connect("mongodb+srv://anshbansal811:ptiRRI9nHI81dp8e@e-commerc.vewyddv.mongodb.net/companyproject");

const postSchema = new mongoose.Schema({
    country:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    domains:{
        type:Array,
        required:false
    },
    alpha_two_code:{
        type:String,
        required:true
    },
    web_pages:{
        type:String,
        required:true
    }
})

const Post = mongoose.model('Post',postSchema);

app.post("/",(req,res)=>{
const {number}=req.body
console.log(typeof number);
    async function getPosts(){
        const WebhookURl = "http://universities.hipolabs.com/search?country=United+States"
        const myPosts =await fetch(WebhookURl);
        const respo = await myPosts.json();
        for(let i=0;i<number;i++){
            console.log(i);
            const post =new Post({
                country:respo[i]['country'],
                name:respo[i]['name'],
                domains:respo[i]['domains'],
                alpha_two_code:respo[i]['alpha_two_code'],
                web_pages:respo[i]['name']
            });
            post.save();
        }
    }
    
    getPosts();
})

app.listen(8000,()=>{
  console.log("Port connected")
})

