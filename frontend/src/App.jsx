
import { useState } from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import React from 'react';
import Header from './components/Header';
import Footer from './components/Footer.jsx';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Buttons from './components/Buttons.jsx';
import './App.css';

const App = ()=> {

    return (
        <div>
            <Router>
                <Header />
                <Buttons />

                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/home" element={<Home />} />
                    <Route path ="/login" element={<Login />} />
                    <Route path ="/register" element={<Register />} />
                </Routes>
                <Footer />
            </Router>
        </div>
    );
};

export default App;
