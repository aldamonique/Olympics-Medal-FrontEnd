import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './Navbar.css';
import olympicsIcon from '../../assets/olimpiadas-icon.png';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuarioId');
    localStorage.clear();
    navigate('/');
  };

  const isLoginPage = location.pathname === '/' || location.pathname === '/criar-conta';

  let roles = [];
  try {
    const rolesData = localStorage.getItem('roles');
    if (rolesData) {
      roles = JSON.parse(rolesData);
    }
  } catch (e) {
    console.error('Erro ao parsear as roles do localStorage:', e);
  }

  const temRoleAdmin = roles.some(role => role.role === 'ROLE_ADMIN');

  return (
    <>
      {!isLoginPage && (
        <header>
          <div className="topbar">
            <div className="container"></div>
          </div>

          <div className="header-inner">
            <div className="logo-container">
              <Link to="/home" className="logo">
                <img src={olympicsIcon} alt="Olimpíadas" className="icone-olimpiadas" />
                Paris 2024
              </Link>
            </div>
            <nav className="navbar">
              <Link to="/home">Home</Link>
              <Link to="/home#medalhas">Medalhas</Link>
              {temRoleAdmin && <Link to="/cadastrar-medalhas">Cadastrar Medalhas</Link>}
              <div className="botao-container">
                <Link to="/"><button onClick={handleLogout}>Logout</button></Link>
              </div>
            </nav>
          </div>
        </header>
      )}
    </>
  );
};

export default Navbar;
