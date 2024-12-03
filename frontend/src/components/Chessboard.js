import React, { useState } from "react";
import Piece from "./Piece";
import "../styles/Chessboard.css";
import { kingMoves, rookMoves, bishopMoves, queenMoves, knightMoves, pawnMoves } from "./Movesets";

const Chessboard = ({ chessboard, onChessboardUpdate, currentTurn, lastMove }) => {
  const [selectedSquare, setSelectedSquare] = useState(null); // Square containing the piece to move
  const [validTargets, setValidTargets] = useState([]); // List of valid target squares
  const [targetSquare, setTargetSquare] = useState(null); // Selected target square awaiting confirmation

  const handleSquareClick = (row, col) => {
    const clickedPiece = chessboard[row][col];
  
    // If no piece is selected and the clicked square has a piece, ensure it's the current turn's piece
    if (!selectedSquare && clickedPiece && clickedPiece.color !== currentTurn) {
      return;
    }
  
    // If the user clicks the starting square, cancel the selection
    if (selectedSquare && row === selectedSquare[0] && col === selectedSquare[1]) {
      setSelectedSquare(null);
      setValidTargets([]);
      setTargetSquare(null);
      return; // Exit early
    }
  
    // If a target square is already selected, confirm the move
    if (targetSquare && row === targetSquare[0] && col === targetSquare[1]) {
      const [selectedRow, selectedCol] = selectedSquare;
      const selectedPiece = chessboard[selectedRow][selectedCol];
  
      const updatedChessboard = chessboard.map((r, rowIndex) =>
        r.map((c, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return selectedPiece; // Place the moving piece
          } else if (rowIndex === selectedRow && colIndex === selectedCol) {
            return null; // Clear the original square
          }
          return c; // Leave other squares unchanged
        })
      );
  
      onChessboardUpdate(updatedChessboard);
      setSelectedSquare(null);
      setValidTargets([]);
      setTargetSquare(null);
      return;
    }
  
    // If a piece is already selected, handle selecting a target square
    if (selectedSquare) {
      if (validTargets.some(([r, c]) => r === row && c === col)) {
        setTargetSquare([row, col]); // Highlight target square for confirmation
      }
      return; // Prevent further actions until confirmation
    }
  
    // Select a piece and calculate valid targets
    if (clickedPiece) {
      setSelectedSquare([row, col]);
      calculateValidTargets(row, col, clickedPiece);
      setTargetSquare(null); // Clear any previously selected target
    }
  };
  

  const calculateValidTargets = (row, col, piece) => {
    let validTargets = [];
    switch (piece.type) {
      case "King":
        validTargets = kingMoves(row, col, chessboard);
        break;
      case "Rook":
        validTargets = rookMoves(row, col, chessboard);
        break;
      case "Bishop":
        validTargets = bishopMoves(row, col, chessboard);
        break;
      case "Queen":
        validTargets = queenMoves(row, col, chessboard);
        break;
      case "Knight":
        validTargets = knightMoves(row, col, chessboard);
        break;
    case "Pawn":
        validTargets = pawnMoves(row, col, chessboard, piece.color, lastMove);
        break;
      default:
        break;
    }
    setValidTargets(validTargets);
  };

  const renderSquare = (row, col) => {
    const isDark = (row + col) % 2 === 1; // Alternate colors
    const piece = chessboard[row][col];
    const isSelected =
      selectedSquare &&
      selectedSquare[0] === row &&
      selectedSquare[1] === col;
    const isValidTarget = validTargets.some(([r, c]) => r === row && c === col);
    const isTargetSquare =
      targetSquare &&
      targetSquare[0] === row &&
      targetSquare[1] === col;
  
    return (
      <div
        key={`${row}-${col}`}
        className={`square ${isDark ? "dark" : "light"} ${
          isSelected ? "selected" : ""
        } ${isTargetSquare ? "target" : ""}`}
        onClick={() => handleSquareClick(row, col)}
      >
        {piece && <Piece type={piece.type} color={piece.color} />}
        {isValidTarget && <div className="dot"></div>} {/* Always render the dot */}
      </div>
    );
  };
  

  return (
    <div className="chessboard-container">
      <div className="chessboard">
        {chessboard.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((_, colIndex) => renderSquare(rowIndex, colIndex))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chessboard;
