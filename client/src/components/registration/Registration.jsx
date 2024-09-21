import React, { useState } from "react";
import "./registration.css";
import { Button, Typography , input} from "@mui/material";
import { Link } from "react-router-dom";
import {useDispatch} from "react-redux"
import { loginUser } from "../../Actions/User";


const Login = () => {
  const [email ,setEmail] = useState("")
  const [password , setPassword] = useState("")
  const dispatch = useDispatch();
  const loginHandler = ()=>{

  }
  return (
    <>
      <div className="Registration-form">
        <form action="" className="loginForm" onSubmit={loginHandler}>
          <Typography variant="h3" style={{ padding: "2vmax" }}>
            Registration
          </Typography>

          <input type="text" value={""} onChange={(e)=>setEmail(e.target.value)} required  placeholder="Name..." />
          <input type="text" value={""} onChange={(e)=>setPassword(e.target.value)} placeholder="Email..." />
          <input type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required  placeholder="Password..." />
          <input type="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Confirm Password..." />

          <Link to="/forgot/password">
            <Typography>forgot Password </Typography>
          </Link>
          <Link to="/register">
            <Typography>New User?</Typography>
          </Link>
          <button>Register Now</button>
        </form>
      </div> 
    </>
  );
};

export default Login;
