import React, { useState, useEffect } from 'react';
import Popup from '../SeguirPaises_Poupup';
import './home.css';
import Footer from '../Footer/footer';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar/Navbar';
import Medalhas from '../Medalhas';

const Home = () => {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const { hash } = useLocation();
  const navigate = useNavigate();

  const openPopup = () => setIsPopupOpen(true);
  const closePopup = () => setIsPopupOpen(false);

  useEffect(() => {
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });

        const timer = setTimeout(() => {
          navigate('/home');
        }, 1000);

        return () => clearTimeout(timer);
      }
    }
  }, [hash, navigate]);

  return (
    <div className="main-content">
      <Navbar />
      <div className='bg-paris'>
        <div className="container">
          <div className="row">
            <div className="col-lg-7">
              <div className="text">
                <h1>Olímpiadas Paris 2024</h1>
                <p>Bem-vindo ao Quadro de Medalhas das Olimpíadas de Paris 2024! <br/>Receba notícias sobre as conquistas dos atletas no seu email! Cadastre-se já!</p>
                <div className="button">
                  <Link to="/home#medalhas" className="btn primary">Visualizar Medalhas</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className='card-div'>
        <button onClick={openPopup} className='card'>Inscreva-se para receber notícias dos países</button>
      </div>
      <Popup isOpen={isPopupOpen} onClose={closePopup} />

      <div class="divider"></div>
      <div className="medalhas" id="medalhas" style={{ padding: '60px 0' }}>
        <Medalhas />
      </div>

      <Footer />
    </div>
  );
};

export default Home;
