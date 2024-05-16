import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true,
    },
    gender:{
        type:String,
        require:true,
    },
    DOB:{
        type:String,
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true,
    },
});

const User = mongoose.model("Users" , UserSchema);
export default User;