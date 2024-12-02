import React, { useState } from "react";
import Piece from "./Piece";
import "../styles/Chessboard.css";

const Chessboard = ({ chessboard, onChessboardUpdate }) => {
  const [selectedSquare, setSelectedSquare] = useState(null); // Square containing the piece to move
  const [targetSquare, setTargetSquare] = useState(null); // Target square for the move

  const handleSquareClick = (row, col) => {
    const clickedPiece = chessboard[row][col];

    if (selectedSquare && targetSquare) {
      // Move confirmed: Move the piece
      const [selectedRow, selectedCol] = selectedSquare;
      const selectedPiece = chessboard[selectedRow][selectedCol];

      // Ensure the user is clicking the target square
      if (row === targetSquare[0] && col === targetSquare[1]) {
        const updatedChessboard = chessboard.map((r, rowIndex) =>
          r.map((c, colIndex) => {
            if (rowIndex === row && colIndex === col) {
              return selectedPiece; // Place the piece in the target square
            } else if (rowIndex === selectedRow && colIndex === selectedCol) {
              return null; // Clear the original square
            }
            return c; // Leave other squares unchanged
          })
        );

        // Update chessboard state and reset selection
        onChessboardUpdate(updatedChessboard);
        setSelectedSquare(null);
        setTargetSquare(null);
      } else {
        // User clicked a different square, cancel target selection
        setTargetSquare(null);
      }
    } else if (selectedSquare) {
      // Target square selection: Set target
      const [selectedRow, selectedCol] = selectedSquare;
      const selectedPiece = chessboard[selectedRow][selectedCol];

      // Ensure the user is clicking a different square
      if (selectedPiece && (row !== selectedRow || col !== selectedCol)) {
        setTargetSquare([row, col]);
      }
    } else if (clickedPiece) {
      // Piece selection: Set selected square
      setSelectedSquare([row, col]);
      setTargetSquare(null); // Clear target square
    }
  };

  const renderSquare = (row, col) => {
    const isDark = (row + col) % 2 === 1; // Alternate colors
    const piece = chessboard[row][col];
    const isSelected =
      selectedSquare &&
      selectedSquare[0] === row &&
      selectedSquare[1] === col;
    const isTarget =
      targetSquare &&
      targetSquare[0] === row &&
      targetSquare[1] === col;

    return (
      <div
        key={`${row}-${col}`}
        className={`square ${isDark ? "dark" : "light"} ${
          isSelected ? "selected" : ""
        } ${isTarget ? "target" : ""}`}
        onClick={() => handleSquareClick(row, col)} // Handle square click
      >
        {piece && <Piece type={piece.type} color={piece.color} />}
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
