import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Rule from './components/Rule';
import AdministrationUser from './components/AdministrationUser';
import './App.css';
import Connexion from './components/Connexion';
import Inscription from './components/Inscription';
import User from './components/User';

function App() {
  return (
    <Router>
      <Navbar />
      <div className='container my-3'>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/connexion" element={<Connexion />} />
          {/* <Route exact path="/deconnexion" element={<Deconnexion />} /> */}
          <Route exact path="/inscription" element={<Inscription />} />
          <Route exact path="/administrationuser" element={<AdministrationUser />} />
          <Route exact path="/user/:userId" element={<User />} />
          <Route exact path="/rule" element={<Rule />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;