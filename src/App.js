import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Dashboard from './components/Dashboard';
import BudgetPage from './components/BudgetPage';
import Rule from './components/Rule';
import Player from './components/Player';
import League from './components/League';
import Team from './components/Team';
import Tournament from './components/Tournament';
import Match from './components/Match';
import './App.css';

function App() {
  return (
    <Router>
      <Navbar />
      <div className='container my-3'>
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/budget" element={<BudgetPage />} />
          <Route exact path="/rule" element={<Rule />} />
          <Route exact path="/player" element={<Player />} />
          <Route exact path="/league" element={<League />} />
          <Route exact path="/team" element={<Team />} />
          <Route exact path="/tournament" element={<Tournament />} />
          <Route exact path="/match" element={<Match />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;