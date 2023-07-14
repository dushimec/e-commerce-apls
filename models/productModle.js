const mongoose = require('mongoose');

var productSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,

    },

    slug:{
        type:String,
        required:true,
        unique:true
    },
    decription:{
        type:String,
        requred:true,

    },
    price:{
        type:Number,
        required:true,
    },
    category:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Category",
    },
    bland:{
         type:String,
        enum:["Apple","Samsung","Lenovo"],
    },
    quantity:Number,
    sold:{
        type:Number,
        default:0
    },
    image:{
        type:Array,
    },
    color:{
        type:String,
        enum:["Black","Brown","Red"],
    },
    ratings:[{
        star:Number,
        postedby:{type:mongoose.Schema.ObjectId,ref:"User"},
    }]
})