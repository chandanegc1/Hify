import jwt from 'jsonwebtoken'
export const authenticateUser = async (req, res, next) => {
    const { token } = req.cookies;
    if (!token) {
      res.status(500).json({success:false , msg:"authentication invalid..."});
    }
    try {
      const { userId, userName , email } = jwt.verify(token , "process.env.JWT_SECRET"); 
      req.user = { userId, userName , email };
      next();
    } catch (error) {
        res.status(500).json({success:false , msg:"authentication invalid"})
    }
  };