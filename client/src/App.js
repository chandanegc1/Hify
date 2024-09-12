import React from 'react'
import Header from './components/Header/Header';
import {BrowserRouter as Router , Routes, Route } from "react-router-dom";
import Login from './components/Login/Login';
import Post from './components/post/Post';

const App = () => {
  return (
    <Router>
      <Header/>
            <Routes>
                {/* <Route path="/" element={<Login/>} /> */}
                <Route path="/newpost" element={<Post/>} />
            </Routes>
    </Router>
  );
}

export default App
