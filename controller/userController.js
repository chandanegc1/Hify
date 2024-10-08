import Post from "../model/post.js";
import User from "../model/user.js"
import { hashPasswordFun } from "../utils/hashPassword.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Registration = async(req , res)=>{
    try {
        const {name , DOB , gender , email , password , confirmPass } = req.body;

        if(!email){
            return res
            .status(400)
            .json({
                success: false,
                message: "email required",
            });
        }
        if(!name){
            return res
            .status(400)
            .json({
                success: false,
                message: "name required",
            });
        }
        if(!password){
            return res
            .status(400)
            .json({
                success: false,
                message: " Password is required",
            });
        }
        if(!confirmPass){
            return res
            .status(400)
            .json({
                success: false,
                message: "confirmation Password is required",
            });
        }
        if(!(password === confirmPass)){
            return res
            .status(400)
            .json({
                success: false,
                message: "Password does not match",
            });
        }

        let user = await User.findOne({email});
        if(user){
            return res
            .status(400)
            .json({
                success: false,
                message: "user already exist",
            });
        }

        const hashpassword =await hashPasswordFun(password);
        user = await User({name , DOB , gender , email , password:hashpassword, 
                avatar:{
                   public_id:"sample_id" ,
                   url:"sampleurl",
                }
              });
        user.save();

        const token = jwt.sign({ _id : user._id} , "process.env.JWT_SECRET");
        const options = {
            expires: new Date(Date.now()+90*24*60*60*1000),
            httpOnly: true
        }
        res.status(201).cookie("token" , token , options)
        .json({
            success:true,
            user,
            token
        });
    } catch (error) {
      res.status(501).json({
        success:false ,
        message:error.message
    });
    }
}

export const login = async (req , res)=>{
  try {
      const { email , password} = req.body;

      const loginUser = await User.findOne({email}).select("+password");
      if(!loginUser){
          return res.status(402).json({
              success:false,
              message:"user does not exist",
          })
      }
  
      const isMatch = await bcrypt.compare(password, loginUser.password); 
      if(!isMatch){
          return res.status(401).json({
              success:false,
              message:"Incorrect Password"
          });
      }

      const token = jwt.sign( { userId : loginUser._id , userName: loginUser.name , email:loginUser.email} , "process.env.JWT_SECRET" );
      const options = {
          expires: new Date( Date.now() + 90 * 24 * 60 * 60 * 1000 ),
          httpOnly: true,
      } 
      res.status(200).cookie("token" , token , options)
      .json({
          success:true,
          loginUser,
          token
      });

  } catch (error) {
          res.status(501).json({
          success:false,
          message:error.message,
      })
  }
}

export const logout = async(req , res)=>{
  try {
      res.status(200).cookie("token" ,null ,{expires: new Date(Date.now()) , httpOnly:true}).json({
          success:true,
          message:"Logged out"
      })
  } catch (error) {
      res.status(501).json({
          success:false,
          message:error.message,
      })
  }
}

export const getUserPrfl = async (req , res)=>{
  try {
      const user = await User.findById(req.params.id);
      if(!user){
         return res.status(401).json({
             success:false,
             message:"user not found",
         })
      }
      res.status(200).json({
          success:true,
          user,
      });
  } catch (error) {
      res.status(501).json({
          success:false,
          message:error.message,
      })
  }
}

export const getAllUser = async (req , res)=>{
  try {
      const users = await User.find({});

      res.status(200).json({
          success:true,
          users,
      });

  } catch (error) {
      res.status(501).json({
          success:false,
          message:error.message,
      })
  }
}

export const updateUserPrfl = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.user.userId});
    let { name, email, password, gender } = req.body;
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    if (password) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password , salt);
      user.password = password;
    }
    if (gender) {
      user.gender = gender;
    }
    await user.save();
    user.password = "null";
    res.status(200).json({user, msg:"update successfully.."});
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteuser = async (req , res)=>{
  try {
      const user = await User.findById(req.user.userId);
      const posts = user.posts; 
      const followers = user.followers;
      const following = user.following;
      const user_id = user._id;
      await user.deleteOne();

      for(let i = 0 ; i<posts.length ;i++){
          const post = await Post.findById(posts[i]);
          await post.deleteOne();
      }                   
      
      for(let i = 0 ; i < followers.length ;i++){
          const follower = await User.findById(followers[i]);
          const index = follower.following.indexOf(user_id);
          follower.following.splice(index , 1);
          await follower.save();
      }

      for(let i = 0 ; i < following.length ;i++){
          const follows = await User.findById(following[i]);
          const index = follows.followers.indexOf(user_id);
          follows.followers.splice(index , 1);
          await follows.save();
      }

      res.status(200).cookie("token" ,null ,{expires: new Date(Date.now()) , httpOnly:true}).json({
          success:true,
          message:"Account Deleted"
      });

  } catch (error) {
      res.status(501).json({
          success:false,
          message:error.message,
      })
  }
} 

export const getCurrentUser = async(req , res)=>{
    try {
        const user = await User.findById(req.user.userId);
        res.status(200).json({
            user:user
        });
    } catch (error) {
        res.status(501).json({
            success:false,
            message:error.message,
        })
    }
}