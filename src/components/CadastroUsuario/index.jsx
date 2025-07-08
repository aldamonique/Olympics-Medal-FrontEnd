import React, { useState } from 'react';
import './cadastroUsuario.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Icon from '../../assets/olimpiada-logo-maior.png'; 

const CadastroUsuario = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [login, setLogin] = useState('');
  const [senha, setSenha] = useState('');
  const [formErrors, setFormErrors] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    
    e.preventDefault();

    if (!nome || !email || !login || !senha) {
      setFormErrors("Todos os campos devem ser preenchidos.");
      return;
    }

    setNome('');
    setEmail('');
    setLogin('');
    setSenha('');
    setFormErrors('');

    try {
      const response = await axios.post('http://192.168.100.76:8082/olimpiada/login/register', {
        nome,
        email,
        login,
        senha
      });
      setFormErrors('');
      setSuccessMessage('Conta criada com sucesso!');
      alert('Conta Criada com sucesso!')
      navigate('/');
      
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);
      setFormErrors('Erro ao cadastrar usuário. Tente novamente.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="criar-conta-tela">
      <div className="logo-container">
        <img src={Icon} alt="Olimpíadas" className="icone" />
        <h1 className="logo-text">Paris 2024</h1>
      </div>
      <div className="criar-conta-container">
        <h1>Criar Conta</h1>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
            autoComplete="name"
          />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
          />
          <input
            type="text"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            placeholder="Login"
            autoComplete="username"
          />
          <input
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            placeholder="Senha"
            autoComplete="new-password"
          />
          {formErrors && <p className="error">{formErrors}</p>}
          {successMessage && <p className="success">{successMessage}</p>}
          <button type="submit">Criar Conta</button>
        </form>
      </div>
    </div>
  );
};

export default CadastroUsuario;
