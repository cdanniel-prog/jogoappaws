import React from 'react';
import ChessBoard from './ChessBoard';

function App() {
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <h1>Jogo de Xadrez</h1>
      <ChessBoard />
    </div>
  );
}

export default App;