import bcrypt from "bcrypt";
export const hashPasswordFun = async(password)=>{
    try {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password , salt);
        return hashPassword;
    } catch (error) {
        console.log(error);
    }
 } 
