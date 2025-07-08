import React from 'react';

const NotFoundPage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '350px' }}>
      <h1>404 - Página Não Encontrada</h1>
      <p>A página que você está procurando não existe.</p>
      <button ><a href="/home" style={{color:'white'}}>Voltar para Home</a></button>
    </div>
  );
};

export default NotFoundPage;
