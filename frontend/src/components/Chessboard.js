import React, { useState } from "react";
import Piece from "./Piece";
import "../styles/Chessboard.css";

const Chessboard = ({ chessboard, onChessboardUpdate }) => {
  const [selectedSquare, setSelectedSquare] = useState(null); // Square containing the piece to move
  const [validTargets, setValidTargets] = useState([]); // List of valid target squares

  const handleSquareClick = (row, col) => {
    const clickedPiece = chessboard[row][col];

    // If the user clicks the starting square, cancel the selection
    if (selectedSquare && row === selectedSquare[0] && col === selectedSquare[1]) {
      setSelectedSquare(null);
      setValidTargets([]); // Clear valid targets
      return; // Exit early
    }

    if (selectedSquare) {
      const [selectedRow, selectedCol] = selectedSquare;
      const selectedPiece = chessboard[selectedRow][selectedCol];
      const targetPiece = chessboard[row][col];

      // Confirm move if target square is clicked
      if (validTargets.some(([r, c]) => r === row && c === col)) {
        if (!targetPiece || targetPiece.color !== selectedPiece.color) {
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
        }

        // Reset after the move
        setSelectedSquare(null);
        setValidTargets([]);
      }
    } else if (clickedPiece) {
      // Select a piece and calculate valid targets
      setSelectedSquare([row, col]);
      calculateValidTargets(row, col, clickedPiece);
    }
  };

  const calculateValidTargets = (row, col, piece) => {
    // Calculate all valid target squares
    const targets = [];

    chessboard.forEach((r, rowIndex) => {
      r.forEach((c, colIndex) => {
        const targetPiece = chessboard[rowIndex][colIndex];
        if (!targetPiece || targetPiece.color !== piece.color) {
          targets.push([rowIndex, colIndex]);
        }
      });
    });

    setValidTargets(targets);
  };

  const renderSquare = (row, col) => {
    const isDark = (row + col) % 2 === 1; // Alternate colors
    const piece = chessboard[row][col];
    const isSelected =
      selectedSquare &&
      selectedSquare[0] === row &&
      selectedSquare[1] === col;
    const isValidTarget = validTargets.some(([r, c]) => r === row && c === col);

    return (
      <div
        key={`${row}-${col}`}
        className={`square ${isDark ? "dark" : "light"} ${
          isSelected ? "selected" : ""
        }`}
        onClick={() => handleSquareClick(row, col)}
      >
        {piece && <Piece type={piece.type} color={piece.color} />}
        {isValidTarget && <div className="dot"></div>}
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
