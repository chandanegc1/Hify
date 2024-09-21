import mongoose from "mongoose";

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        require:[true , "please enter a name"],
    },
    avatar:{
        public_id:String,
        url:String,
    },
    email:{
        type:String,
        require:true,
        unique:[true , "Email already exist"],
    },
    password:{
        type:String,
        require:[true , "please enter a password"],
        minlength:[6 ,"Password must be at least 6 characters"],
        select: false,
    },
    confirmPass:{
        type:String,
        require:[true , "please enter confirmation password"],
        minlength:[6 ,"Password must be at least 6 characters"],
        select: false,
    },
    gender:{
        type:String,
        enum:["Male" , "Female" , "other"]
    },
    DOB:{
        type:Date,
    },
    posts:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Posts",
        }
    ],
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Users",
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Users",
        }
    ],
    resetPasswordToken:String,
    resetPasswordExpire:Date,
});


const User = mongoose.model("Users" , UserSchema);
export default User;