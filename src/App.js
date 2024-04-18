import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Rule from './components/Rule';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className='container my-3'>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/rule" element={<Rule />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;