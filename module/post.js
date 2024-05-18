import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    caption:{
        type:String,
    },
    post:{
        type:String,
        required:true
    },
    image:{
        public_id:String,
        url:String
    },
    createdAt:{
        type:Date,
        default:Date.now,
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
    },
    likes:[
        {
            userName:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"user"
            },
            createdAt:{
                type:Date,
                default:Date.now,
            },
        }
    ],
    comments:[
        {
            userName:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"user"
            },
            comment:{
                type:String,
                require:true,
            },
            createdAt:{
                type:Date,
                default:Date.now,
            },
            like:{
                type:Number
            }
        }
    ]
});

const Post = mongoose.model("Posts" , PostSchema);
export default Post;