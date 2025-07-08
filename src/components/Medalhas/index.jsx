import { useState, useEffect } from 'react';
import React from 'react';
import axios from "axios";
import Flag from 'react-world-flags';
import './quadroMedalhas.css';
import Logo from '../../assets/olimpiadas-icon.png';

function Medalhas() {
  const [medalhas, setMedalhas] = useState([]);
  const [erro, setErro] = useState(null);
  const [paisesExpandidos, setPaisesExpandidos] = useState([]);
  const [detalhesPaises, setDetalhesPaises] = useState({});

  useEffect(() => {
    const buscarMedalhas = async () => {
      try {
        const token = localStorage.getItem('token');
        const resposta = await axios.get("http://192.168.100.76:8082/olimpiada/medalhas", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setMedalhas(resposta.data);
        console.log('Dados recebidos:', resposta.data);
      } catch (error) {
        setErro(error.message);
        console.log('Erro ao buscar medalhas:', error);
      }
    };
    buscarMedalhas();
  }, []);

  const buscarDetalhesPais = async (paisId) => {
    try {
      const token = localStorage.getItem('token');
      const resposta = await axios.get(`http://192.168.100.76:8082/olimpiada/paises/${paisId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setDetalhesPaises((prevDetalhes) => ({
        ...prevDetalhes,
        [paisId]: resposta.data
      }));
    } catch (error) {
      console.error('Erro ao buscar detalhes do país:', error);
    }
  };


  const manipularCliquePais = (paisNome, paisId) => {
    setPaisesExpandidos((prevPaises) => {
      const estaExpandidos = prevPaises.includes(paisNome);
      let novosPaises;
  
      if (estaExpandidos) {
        // Se o país está expandido, removemos da lista
        novosPaises = prevPaises.filter(nome => nome !== paisNome);
      } else {
        // Se o país não está expandido, adicionamos à lista
        novosPaises = [...prevPaises, paisNome];
        
        // Se o país não está expandido e seus detalhes ainda não foram carregados
        if (!detalhesPaises[paisId]) {
          buscarDetalhesPais(paisId);
        }
      }
  
      return novosPaises;
    });
  };
  

  const medalhasPorPais = medalhas.reduce((acc, medalha) => {
    const nomePais = medalha.paisDto?.nome;
    const codigoPais = medalha.paisDto?.codigo;
    if (!acc[nomePais]) {
      acc[nomePais] = { codigo: codigoPais, medalhas: [] };
    }
    acc[nomePais].medalhas.push(medalha);
    return acc;
  }, {});
  
  const paisesOrdenados = Object.keys(medalhasPorPais).sort((a, b) => a.localeCompare(b));
  return (
    <>
      <header className="titulo">
        <img src={Logo} alt="Olimpíadas" className="logo" />
        <h2 className='subtitulo'>Medalhas</h2>
        Paris 2024
      </header>

      <section className="lista-medalhas">
        <table className="tabela-expandivel">
          <thead style={{ backgroundColor: '#F0E68C' }}>
            <tr>
              <th>País</th>
              <th>Esporte</th>
              <th>Descrição</th>
              <th>Nome do Atleta</th>
              <th>Tipo</th>
            </tr>
          </thead>
          <tbody>
            {(paisesOrdenados).map((paisNome) => (
              <React.Fragment key={paisNome}>
                <tr onClick={() => manipularCliquePais(paisNome, medalhasPorPais[paisNome].medalhas[0]?.paisDto?.id)} className="linha-pais">
                  <td colSpan="5">
                  <div className="conteudo-pais">
                      <div className='bandeira-pais'>
                        <Flag code={medalhasPorPais[paisNome].codigo} style={{ width: '20px', height: '15px' }} />
                        <strong>{paisNome}</strong>
                      </div>
                      <div>
                        <button className="botao-expandir">
                        {paisesExpandidos.includes(paisNome) ?
                        `Ocultar ${medalhasPorPais[paisNome].medalhas.length} ${medalhasPorPais[paisNome].medalhas.length === 1 ? 'Medalha' : 'Medalhas'}` :
                        `Mostrar ${medalhasPorPais[paisNome].medalhas.length} ${medalhasPorPais[paisNome].medalhas.length === 1 ? 'Medalha' : 'Medalhas'}`
                      }
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
                {paisesExpandidos.includes(paisNome) && medalhasPorPais[paisNome].medalhas.map((medalha) => (
                  <tr key={medalha.id} className="linha-medalha">
                    <td>{medalha.paisDto.nome}</td>
                    <td>{medalha.esporteDto.nome}</td>
                    <td>{medalha.descricao}</td>
                    <td>{medalha.nomeAtleta}</td>
                    <td>{medalha.tipoMedalha}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </section>
    </>
  );
}

export default Medalhas;
