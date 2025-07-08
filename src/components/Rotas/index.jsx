import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from '../Home';
import CadastroMedalhas from '../CadastroMedalhas';
import Login from '../Login';
import CadastroUsuario from '../CadastroUsuario';
import PrivateRoute from '../PrivateRoute/PrivateRoute'; 
import PublicRoute from '../PublicRoute/PublicRoute'; 
import NotFoundPage from '../NotFoundPage/NotFoundPage';



function Rotas() {
  return (
    <BrowserRouter>
    
      <Routes>
        <Route path="*" element={<PrivateRoute element={<NotFoundPage/>} />} />

        {/* Rota pública - acessível sem autenticação */}
        <Route path="/" element={<PublicRoute element={<Login />} restricted={false} />} />
        <Route path="/criar-conta" element={<PublicRoute element={<CadastroUsuario />} restricted={false} />} />

        {/* Rotas privadas - acessíveis apenas com autenticação */}
        <Route path="/home" element={<PrivateRoute element={<Home />} />} />
        <Route path="/cadastrar-medalhas" element={<PrivateRoute element={<CadastroMedalhas />} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;
