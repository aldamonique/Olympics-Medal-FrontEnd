import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import { useNavigate } from 'react-router-dom';
import Icon from '../../assets/olimpiada-logo-maior.png'; 

const Login = () => {
  const [login, setLogin] = useState(''); 
  const [senha, setSenha] = useState(''); 
  const [error, setError] = useState(''); 
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();
  
  console.log('Removendo token do localStorage');
  localStorage.removeItem('token');
  localStorage.removeItem('usuarioId');
  console.log('Token removido:', localStorage.getItem('token')); // Deve retornar null
  localStorage.clear();


  const handleLogin = async (event) => {
    event.preventDefault(); 
    
    if (!login || !senha) {
      setError("Preencha todos os campos");
      return;
    }
    setIsLoading(true);
    setError("");

    try {
      
      const response = await axios.post('http://192.168.100.76:8082/olimpiada/login', { login, senha });

     
      const { token } = response.data;

      
      localStorage.setItem('token', token);
      console.log('Token armazenado:', token);

      
      const userResponse = await axios.get('http://192.168.100.76:8082/olimpiada/login/usuario', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const { id: usuarioId } = userResponse.data;
      localStorage.setItem('usuarioId', usuarioId);
      const { roles: usuarioRole } = userResponse.data;
      localStorage.setItem('roles', JSON.stringify(usuarioRole));

      console.log('Login bem-sucedido', response.data);
      console.log('Usuario ID:', usuarioId);
      console.log('Redirecionando para /medalhas');
      
      // Redireciona para a página de medalhas
      navigate('/home');
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      setError('Usuário ou senha inválidos');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-screen">
      <div className="logo-container">
        <img src={Icon} alt="Olimpíadas" className="icone" />
        <h1 className="logo-text">Paris 2024</h1>
      </div>
      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="Login"
            value={login}
            onChange={(e) => { setLogin(e.target.value); setError(""); }}
            autoComplete="username"
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => { setSenha(e.target.value); setError(""); }}
            autoComplete="current-password"
          />
          {error && <p className="error">{error}</p>}
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar'}
          </button>
          
          <button type="button" onClick={() => navigate('/criar-conta')}>
            Criar Conta
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
