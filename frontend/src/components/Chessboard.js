import React, { useState } from "react";
import Piece from "./Piece";
import "../styles/Chessboard.css";

const Chessboard = ({ chessboard, onChessboardUpdate }) => {
  const [selectedSquare, setSelectedSquare] = useState(null); // Square containing the piece to move
  const [validTargets, setValidTargets] = useState([]); // List of valid target squares
  const [targetSquare, setTargetSquare] = useState(null); // Selected target square awaiting confirmation

  const handleSquareClick = (row, col) => {
    const clickedPiece = chessboard[row][col];

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
    let possibleMoves = [];

    if (piece.type === "King") {
      // Possible moves for a King: one square in any direction
      possibleMoves = [
        [row - 1, col - 1], // Top-left
        [row - 1, col],     // Top
        [row - 1, col + 1], // Top-right
        [row, col - 1],     // Left
        [row, col + 1],     // Right
        [row + 1, col - 1], // Bottom-left
        [row + 1, col],     // Bottom
        [row + 1, col + 1], // Bottom-right
      ];
    } else if (piece.type === "Rook") {
      // Possible moves for a Rook: any number of squares along rows or columns
      for (let r = 0; r < chessboard.length; r++) {
        if (r !== row) {
          possibleMoves.push([r, col]);
        }
      }
      for (let c = 0; c < chessboard[row].length; c++) {
        if (c !== col) {
          possibleMoves.push([row, c]);
        }
      }
    }

    // Filter moves to keep only valid ones
    const targets = possibleMoves.filter(([r, c]) => {
      const isInBounds = r >= 0 && r < chessboard.length && c >= 0 && c < chessboard[r].length;
      if (!isInBounds) return false;

      const targetPiece = chessboard[r][c];
      return !targetPiece || targetPiece.color !== piece.color;
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
