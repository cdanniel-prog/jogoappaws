import React, { useState } from 'react';

const ChessBoard = () => {
  const initialBoard = [
    ['♜', '♞', '♝', '♛', '♚', '♝', '♞', '♜'],
    ['♟', '♟', '♟', '♟', '♟', '♟', '♟', '♟'],
    Array(8).fill(''),
    Array(8).fill(''),
    Array(8).fill(''),
    Array(8).fill(''),
    ['♙', '♙', '♙', '♙', '♙', '♙', '♙', '♙'],
    ['♖', '♘', '♗', '♕', '♔', '♗', '♘', '♖'],
  ];

  const [board, setBoard] = useState(initialBoard);
  const [selectedPosition, setSelectedPosition] = useState(null); // Posição selecionada no tabuleiro
  const [capturedWhite, setCapturedWhite] = useState(0); // Pontos do jogador branco
  const [capturedBlack, setCapturedBlack] = useState(0); // Pontos do jogador preto
  const [gameOver, setGameOver] = useState(false); // Estado do fim de jogo
  const [turn, setTurn] = useState('white'); // Turno atual ('white' ou 'black')

  // Função para verificar se uma posição está dentro dos limites do tabuleiro
  const isValidPosition = (row, col) => row >= 0 && row < 8 && col >= 0 && col < 8;

  // Função para verificar se um movimento é válido para uma peça específica
  const isValidMove = (piece, startRow, startCol, endRow, endCol) => {
    const isWhitePiece = piece >= 'A' && piece <= 'Z';
    const isBlackPiece = piece >= 'a' && piece <= 'z';

    // Verifica se o turno corresponde à cor da peça
    if ((isWhitePiece && turn !== 'white') || (isBlackPiece && turn !== 'black')) {
      return false;
    }

    // Verifica se a posição de destino está vazia ou contém uma peça adversária
    const destinationPiece = board[endRow][endCol];
    if (destinationPiece) {
      const isDestinationWhite = destinationPiece >= 'A' && destinationPiece <= 'Z';
      const isDestinationBlack = destinationPiece >= 'a' && destinationPiece <= 'z';
      if ((isWhitePiece && isDestinationWhite) || (isBlackPiece && isDestinationBlack)) {
        return false; // Não pode capturar peças da mesma cor
      }
    }

    // Implementação de movimentos válidos para cada peça
    switch (piece.toLowerCase()) {
      case '♟': // Peão
        return isValidPawnMove(piece, startRow, startCol, endRow, endCol);
      case '♜': // Torre
        return isValidRookMove(startRow, startCol, endRow, endCol);
      case '♞': // Cavalo
        return isValidKnightMove(startRow, startCol, endRow, endCol);
      case '♝': // Bispo
        return isValidBishopMove(startRow, startCol, endRow, endCol);
      case '♛': // Rainha
        return isValidQueenMove(startRow, startCol, endRow, endCol);
      case '♚': // Rei
        return isValidKingMove(startRow, startCol, endRow, endCol);
      default:
        return false;
    }
  };

  // Movimento do peão
  const isValidPawnMove = (piece, startRow, startCol, endRow, endCol) => {
    const direction = piece === '♙' ? -1 : 1; // Brancas movem para cima, pretas para baixo
    const startRank = piece === '♙' ? 6 : 1; // Linha inicial do peão

    // Movimento simples (uma casa para frente)
    if (startCol === endCol && startRow + direction === endRow && !board[endRow][endCol]) {
      return true;
    }

    // Movimento inicial duplo (duas casas para frente)
    if (
      startCol === endCol &&
      startRow + 2 * direction === endRow &&
      startRow === startRank &&
      !board[endRow][endCol] &&
      !board[startRow + direction][startCol]
    ) {
      return true;
    }

    // Captura diagonal
    if (
      Math.abs(startCol - endCol) === 1 &&
      startRow + direction === endRow &&
      board[endRow][endCol]
    ) {
      return true;
    }

    return false;
  };

  // Movimento da torre
  const isValidRookMove = (startRow, startCol, endRow, endCol) => {
    if (startRow !== endRow && startCol !== endCol) return false; // Deve mover em linha reta

    const stepRow = startRow === endRow ? 0 : (endRow - startRow > 0 ? 1 : -1);
    const stepCol = startCol === endCol ? 0 : (endCol - startCol > 0 ? 1 : -1);

    let row = startRow + stepRow;
    let col = startCol + stepCol;

    while (row !== endRow || col !== endCol) {
      if (board[row][col]) return false; // Caminho bloqueado
      row += stepRow;
      col += stepCol;
    }

    return true;
  };

  // Movimento do cavalo
  const isValidKnightMove = (startRow, startCol, endRow, endCol) => {
    const rowDiff = Math.abs(startRow - endRow);
    const colDiff = Math.abs(startCol - endCol);
    return (rowDiff === 2 && colDiff === 1) || (rowDiff === 1 && colDiff === 2);
  };

  // Movimento do bispo
  const isValidBishopMove = (startRow, startCol, endRow, endCol) => {
    if (Math.abs(startRow - endRow) !== Math.abs(startCol - endCol)) return false; // Deve mover na diagonal

    const stepRow = endRow > startRow ? 1 : -1;
    const stepCol = endCol > startCol ? 1 : -1;

    let row = startRow + stepRow;
    let col = startCol + stepCol;

    while (row !== endRow && col !== endCol) {
      if (board[row][col]) return false; // Caminho bloqueado
      row += stepRow;
      col += stepCol;
    }

    return true;
  };

  // Movimento da rainha
  const isValidQueenMove = (startRow, startCol, endRow, endCol) => {
    return isValidRookMove(startRow, startCol, endRow, endCol) || isValidBishopMove(startRow, startCol, endRow, endCol);
  };

  // Movimento do rei
  const isValidKingMove = (startRow, startCol, endRow, endCol) => {
    const rowDiff = Math.abs(startRow - endRow);
    const colDiff = Math.abs(startCol - endCol);
    return (rowDiff <= 1 && colDiff <= 1);
  };

  // Função para renderizar o quadrado
  const renderSquare = (piece, row, col) => {
    const isLight = (row + col) % 2 === 0;
    const isSelected = selectedPosition?.row === row && selectedPosition?.col === col;
    const squareStyle = {
      width: '40px', // Tamanho reduzido para caber em telas menores
      height: '40px',
      backgroundColor: isSelected ? '#a0d8ef' : isLight ? '#f0d9b5' : '#b58863',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '20px', // Fonte menor para caber nos quadrados
      fontWeight: 'bold',
      cursor: 'pointer',
    };

    return (
      <div
        key={`${row}-${col}`}
        style={squareStyle}
        onClick={() => handleSquareClick(row, col)}
        onTouchStart={() => handleSquareClick(row, col)} // Suporte para touchscreen
      >
        {piece}
      </div>
    );
  };

  // Função para lidar com cliques nos quadrados
  const handleSquareClick = (row, col) => {
    if (gameOver) return; // Impede interação se o jogo acabou

    if (!selectedPosition) {
      // Seleciona a peça se houver uma na posição clicada
      if (board[row][col]) {
        setSelectedPosition({ row, col });
      }
    } else {
      const { row: selectedRow, col: selectedCol } = selectedPosition;
      const piece = board[selectedRow][selectedCol];

      // Verifica se o movimento é válido
      if (isValidMove(piece, selectedRow, selectedCol, row, col)) {
        const newBoard = [...board];
        newBoard[row][col] = piece;
        newBoard[selectedRow][selectedCol] = '';

        // Captura a peça adversária, se houver
        if (board[row][col]) {
          if (board[row][col] >= 'a' && board[row][col] <= 'z') {
            setCapturedWhite(capturedWhite + 1); // Incrementa pontos do jogador branco
          } else if (board[row][col] >= 'A' && board[row][col] <= 'Z') {
            setCapturedBlack(capturedBlack + 1); // Incrementa pontos do jogador preto
          }
        }

        // Alterna o turno
        setTurn(turn === 'white' ? 'black' : 'white');

        // Move a peça para a nova posição
        setBoard(newBoard);
      }

      setSelectedPosition(null); // Limpa a seleção
    }
  };

  // Renderiza o placar
  const renderScoreboard = () => {
    const scoreboardStyle = {
      marginTop: '10px',
      display: 'flex',
      flexDirection: 'column', // Placar vertical para economizar espaço
      alignItems: 'center',
      padding: '10px',
      backgroundColor: '#f9f9f9',
      borderRadius: '10px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    };

    const playerStyle = {
      textAlign: 'center',
      padding: '5px',
      borderRadius: '8px',
      width: '100%',
      marginBottom: '5px',
    };

    const whitePlayerStyle = {
      ...playerStyle,
      backgroundColor: '#e3f2fd', // Azul claro para o jogador branco
    };

    const blackPlayerStyle = {
      ...playerStyle,
      backgroundColor: '#ffebee', // Rosa claro para o jogador preto
    };

    const titleStyle = {
      fontSize: '16px',
      fontWeight: 'bold',
      marginBottom: '5px',
    };

    const pointsStyle = {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#333',
    };

    return (
      <div style={scoreboardStyle}>
        <div style={whitePlayerStyle}>
          <h3 style={titleStyle}>Jogador Branco</h3>
          <div style={pointsStyle}>{capturedWhite} Pontos</div>
        </div>
        <div style={blackPlayerStyle}>
          <h3 style={titleStyle}>Jogador Preto</h3>
          <div style={pointsStyle}>{capturedBlack} Pontos</div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Arial, sans-serif' }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
          {board.map((row, rowIndex) => (
            <div key={rowIndex} style={{ display: 'flex' }}>
              {row.map((piece, colIndex) => renderSquare(piece, rowIndex, colIndex))}
            </div>
          ))}
        </div>
        {renderScoreboard()}
      </div>
      {gameOver && (
        <div style={{ marginTop: '10px', fontSize: '18px', fontWeight: 'bold', color: '#d32f2f' }}>
          FIM DE JOGO!
        </div>
      )}
    </div>
  );
};

export default ChessBoard;