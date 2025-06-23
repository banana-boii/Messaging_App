import './App.css';
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import LoginPage from "./LoginPage";
import RegisterPage from "./RegisterPage";
import ChatPage from "./ChatPage";

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/Chat" element={<ChatPage />} />
      </Routes>
    </div>
  );
}

export default App;
