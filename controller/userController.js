import User from "../module/user.js"
import { hashPasswordFun } from "../utils/hashPassword.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const Registration = async(req , res)=>{
    try {
        const {name , DOB , gender , email , password } = req.body;
        const hashpassword =await hashPasswordFun(password);
        const user = await User({name , DOB , gender , email , password:hashpassword });
        user.save();
        res.status(200).json({success:true , data:user});
    } catch (error) {
        console.log(error)
        res.status(200).json({msg:error});
    }
}

export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
      if (!email || !password) return res.status(400).json({ msg: 'Please provide email and password' });
      
      const user = await User.findOne({ email });
      if (!user) return res.status(400).json({ msg: 'Invalid email or password' });
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: 'Invalid email or password' });
      const token = jwt.sign(
        { name: user.name, email: user.email, userId: user._id },
        'abs'
      );
      res.cookie('token', token, {
        httpOnly: true,
        // secure: true
        expiresIn:'100d'
      });
      user.password = "null";
      res.status(200).json({user , msg: 'User logged in' });
    } catch (error) {
      res.status(500).json({ msg: 'Internal server error' });
    }
  };

  export const logout = async(req , res)=>{
    try {
      res.cookie('token' , 'logout' , {
        httpOnly:true,
        expiresIn: new Date(Date.now()),
      })
      res.status(200).json({msg:'user logged out'})
    } catch (error) {
      res.status(400).json({msg:error})
    }
  }

  export const currentUser = async(req , res)=>{
    try {
      const user = await User.findOne({_id:req.user.userId});
      user.password = "null";
      res.status(200).json({user});
    } catch (error) {
      res.status(400).json({msg:"something went wrong"}); 
    }
  }

  export const updateUserPrfl = async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.user.userId});
      const { name, email, password, gender } = req.body;
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