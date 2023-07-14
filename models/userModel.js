const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const { ObjectId } = require('mongodb');
var userSchema = new mongoose.Schema ({
    fistname: {
        type:String,
        required:true,
    
    },
    lastname: {
        type:String,
        required:true,
      
    },
    email:{
        type: String,
        required: true,
        unique:true,
    },
    mobile:{
        type: String,
        required: true,
        unique:true

    },
    password: {
        type: String,
        required: true
    },
    role:{
        type:String,
        default:'User',
    },
    isBlocked:{
        type: Boolean,
        default:false,
    },
    cart: {
        type: Array,
        defaultt: [],
    },
    address: [{type: mongoose.Schema.Types.ObjectId, ref: 'Address'}],
    wishlist: [{type: mongoose.Schema.Types.ObjectId, ref: 'Product'}],
    refreshToken:{
        type:String,
    },
},
{
    timestamps: true,
});

userSchema.pre('save', async function (next){
    const salt = await bcrypt.genSaltSync(10);
    this.password = await bcrypt.hash(this.password, salt);
});
userSchema.methods.isPasswordMatched = async function (enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password)
}


module.exports = mongoose.model('User',userSchema);