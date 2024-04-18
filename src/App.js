import React from 'react';
import { BrowserRouter as BrowserRouter, Route, Routes } from 'react-router-dom';
import BudgetPage from './pages/BudgetPage';
import Navigation from './layout/navigation'

const App = () => {
  return (
    <BrowserRouter>
    <Navigation />
      <Routes>
        <Route path="/budget" element={<BudgetPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
