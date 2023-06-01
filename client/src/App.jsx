import { useContext, useState } from "react";
import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import Chat from "./pages/Chat.jsx"
import Register from "./pages/Register.jsx";
import Login from "./pages/Login.jsx";
import Notfound from "./pages/Nofound.jsx";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from "react-bootstrap";
import NavBar from "./components/NavBar.jsx";
import { AuthContext } from "./context/AuthContext.jsx";
import {ChatContextProvider} from "./context/ChatContext.jsx";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <ChatContextProvider user={user}>
      <NavBar />
      <Container>
        <Routes>
          <Route path="/" element={user ? <Chat /> : <Login />} />
          <Route path="/chat" element={user ? <Chat /> : <Login />} />
          <Route path="/register" element={user ? <Chat /> : <Register />} />
          <Route path="/login" element={user ? <Chat /> : <Login />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </Container>
    </ChatContextProvider>
  )
}

export default App
