import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './medalha.css';
import Navbar from '../Navbar/Navbar';
import Footer from '../Footer/footer';

const CadastroMedalha = () => {
  const [paises, setPaises] = useState([]);
  const [esportes, setEsportes] = useState([]);
  const [paisId, setPaisId] = useState('');
  const [esporteId, setEsporteId] = useState('');
  const [atletaNome, setAtletaNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [medalhaTipo, setMedalhaTipo] = useState('ouro');
  const [formErrors, setFormErrors] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      setFormErrors('Token não encontrado. Faça login novamente.');
      return;
    }

    axios.get('http://192.168.100.76:8082/olimpiada/paises', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => setPaises(response.data))
    .catch(error => {
      setFormErrors('Erro ao carregar países.');
    });

    axios.get('http://192.168.100.76:8082/olimpiada/esportes', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(response => setEsportes(response.data))
    .catch(error => {
      setFormErrors('Erro ao carregar esportes.');
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!paisId || !esporteId || !atletaNome) {
      setFormErrors("Todos os campos devem ser preenchidos.");
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      setFormErrors('Token não encontrado. Faça login novamente.');
      return;
    }

    try {
      const tipoMedalhaMap = {
        ouro: 'Ouro',
        prata: 'Prata',
        bronze: 'Bronze'
      };

      await axios.post('http://192.168.100.76:8082/olimpiada/medalhas/cadastrar', {
        paisId,
        esporteId,
        nomeAtleta: atletaNome,
        descricao,
        tipoMedalha: tipoMedalhaMap[medalhaTipo]
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setPaisId('');
      setEsporteId('');
      setAtletaNome('');
      setDescricao('');
      setMedalhaTipo('ouro');
      setFormErrors('');
      alert('Medalha cadastrada com sucesso');
    } catch (error) {
      setFormErrors("Erro ao cadastrar medalha. Tente novamente.");
    }
  };

  return (
    <div className='cadastro'>
      <Navbar />
      <div className="medalha-cadastro">
        <h1>Cadastro de Medalhas</h1>
        <form onSubmit={handleSubmit}>
          <label>
            País:
            <select value={paisId} onChange={(e) => setPaisId(e.target.value)}>
              <option value="">Selecione um país</option>
              {paises.map(pais => (
                <option key={pais.id} value={pais.id}>{pais.nome}</option>
              ))}
            </select>
          </label>

          <label>
            Esporte:
            <select value={esporteId} onChange={(e) => setEsporteId(e.target.value)}>
              <option value="">Selecione um esporte</option>
              {esportes.map(esporte => (
                <option key={esporte.id} value={esporte.id}>{esporte.nome}</option>
              ))}
            </select>
          </label>

          <label>
            Nome do Atleta:
            <input
              type="text"
              value={atletaNome}
              onChange={(e) => setAtletaNome(e.target.value)}
              placeholder="Digite o nome do atleta"
            />
          </label>

          <label>
            Descrição:
            <input
              type="text"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Digite uma descrição"
            />
          </label>

          <label>
            Tipo de Medalha:
            <select value={medalhaTipo} onChange={(e) => setMedalhaTipo(e.target.value)}>
              <option value="ouro">Ouro</option>
              <option value="prata">Prata</option>
              <option value="bronze">Bronze</option>
            </select>
          </label>

          {formErrors && <p className="form-error">{formErrors}</p>}

          <button type="submit">Cadastrar Medalha</button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default CadastroMedalha;
