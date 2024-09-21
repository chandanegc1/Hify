import React from 'react'
import Header from './components/Header/Header';
import {BrowserRouter as Router , Routes, Route } from "react-router-dom";
import Login from './components/Login/Login';
import Post from './components/post/Post';
import Registration from './components/registration/Registration';
import CreatePost from './components/create-post/CreatePost';

const App = () => {
  return (
    <Router>
      <Header/>
            <Routes>
                <Route path="/" element={<Post/>} />
                <Route path="/login" element={<Login/>} />
                <Route path="/newpost" element={<CreatePost/>} />
                <Route path="/account" element={<Registration/>} />
            </Routes>
    </Router>
  );
}

export default App
