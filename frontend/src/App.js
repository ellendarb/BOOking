import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <nav className="nav">
          <Link to="/" className="nav-link">Главная</Link>
          <Link to="/register" className="nav-link">Регистрация</Link>
          <Link to="/login" className="nav-link">Вход</Link>
        </nav>

        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<div className="home">Добро пожаловать в систему бронирования</div>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;