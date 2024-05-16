import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    caption:{
        type:String,
    },
    post:{
        type:String,
        require:true
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    userName:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    likes:[
        {
            userId:{
                type:String
            },
            createdAt:{
                type:Date,
                default:Date.now,
            },
        }
    ],
    comments:[
        {
            user:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"user",
            },
            comment:{
                type:String,
                require:true,
            },
            createdAt:{
                type:Date,
                default:Date.now,
            }
        }
    ]
});

const Post = mongoose.model("Posts" , PostSchema);
export default Post;