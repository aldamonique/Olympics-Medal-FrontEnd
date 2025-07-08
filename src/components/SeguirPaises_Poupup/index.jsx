import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Flag from 'react-world-flags';
import './index.css'; 

const Popup = ({ isOpen, onClose }) => {
  const [paises, setPaises] = useState([]);
  const [selectedCountries, setSelectedCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const userId = localStorage.getItem('usuarioId');
  const token = localStorage.getItem('token');
  
  useEffect(() => {
    if (isOpen) {
      if (!token) {
        setError('Token não encontrado. Faça login novamente.');
        return;
      }

      const fetchPaises = async () => {
        try {
        
          const paisesResponse = await axios.get("http://192.168.100.76:8082/olimpiada/paises", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setPaises(paisesResponse.data);
          
         
          const seguidosResponse = await axios.get(`http://192.168.100.76:8082/olimpiada/login/${userId}/paises-seguidos`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setSelectedCountries(seguidosResponse.data);
          setIsLoading(false);
        } catch (error) {
          setError(error.message);
          setIsLoading(false);
        }
      };

      fetchPaises();
    }
  }, [isOpen, token, userId]);

  const handleCheckboxChange = (paisId) => {
    setSelectedCountries((prevSelected) => {
      const isSelected = prevSelected.includes(paisId);
      return isSelected
        ? prevSelected.filter((id) => id !== paisId)
        : [...prevSelected, paisId];
    });
  };

  const handleSave = async () => {
    if (!token) {
      setError('Token não encontrado. Faça login novamente.');
      return;
    }
    if (selectedCountries.length === 0) {
      alert('Nenhum país selecionado.');
      return;
    }

    if (!window.confirm('Tem certeza de que deseja salvar as alterações?')) {
      return;
    }

    setIsSaving(true);
    try {
      const responses = await Promise.all(
        selectedCountries.map(paisId =>
          axios.post('http://192.168.100.76:8082/olimpiada/login/associar-pais', {
            usuarioId: userId,
            paisId: paisId
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          })
        )
      );
      console.log('Respostas da API:', responses);
      alert('Países associados com sucesso!');
    } catch (error) {
      console.error('Erro ao associar países:', error.response ? error.response.data : error.message);
      alert('Erro ao associar países: ' + (error.response ? error.response.data.message : error.message));
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  const handleCancel = () => {
    setSelectedCountries([]);
    onClose();
  };

  const uniquePaises = Array.from(new Set(paises.map(pais => pais.id)))
    .map(id => paises.find(pais => pais.id === id));

  if (!isOpen) return null;

  return (
    <div className='poupup'>
      <div className="popup-overlay">
        <div className="popup-content">
          <h2>Selecione os Países que deseja seguir</h2>
          {isLoading ? (
            <p>Carregando...</p>
          ) : error ? (
            <p className="error">Erro ao carregar países: {error}</p>
          ) : (
            <div>
              <ul className="lista-paises">
                {uniquePaises.map((pais) => (
                  <li key={pais.id} className="item-pais">
                    <label>
                      <span style={{ display: 'flex', alignItems: 'center' }}>
                        <Flag code={pais.codigo} style={{ width: '20px', height: '15px', marginRight: '10px' }} />
                        {pais.nome}
                      </span>
                      <input className='checkbox'
                        type="checkbox"
                        checked={selectedCountries.includes(pais.id)}
                        onChange={() => handleCheckboxChange(pais.id)}
                        style={{ width: '20px' }}
                      />
                    </label>
                  </li>
                ))}
              </ul>
              <div className="popup-buttons">
                <button onClick={handleCancel}>Cancelar</button>
                <button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </div>
          )}
          <button className="popup-close" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
