import React, { useState } from "react";
import Piece from "./Piece";
import "../styles/Chessboard.css";

const Chessboard = ({ chessboard, onChessboardUpdate }) => {
  const [selectedSquare, setSelectedSquare] = useState(null);

  const handleSquareClick = (row, col) => {
    const clickedPiece = chessboard[row][col];

    if (selectedSquare) {
      // A piece is already selected, attempt to move
      const [selectedRow, selectedCol] = selectedSquare;
      const selectedPiece = chessboard[selectedRow][selectedCol];

      if (selectedPiece && (row !== selectedRow || col !== selectedCol)) {
        // Update the chessboard state
        const updatedChessboard = chessboard.map((r, rowIndex) =>
          r.map((c, colIndex) => {
            if (rowIndex === row && colIndex === col) {
              return selectedPiece; // Move the piece here
            } else if (rowIndex === selectedRow && colIndex === selectedCol) {
              return null; // Clear the original position
            }
            return c; // Leave other squares unchanged
          })
        );

        onChessboardUpdate(updatedChessboard); // Notify parent of the updated board
      }

      // Deselect the square
      setSelectedSquare(null);
    } else if (clickedPiece) {
      // Only allow selecting a square with a piece
      setSelectedSquare([row, col]);
    }
  };

  const renderSquare = (row, col) => {
    const isDark = (row + col) % 2 === 1; // Alternate colors
    const piece = chessboard[row][col];
    const isSelected =
      selectedSquare &&
      selectedSquare[0] === row &&
      selectedSquare[1] === col;

    return (
      <div
        key={`${row}-${col}`}
        className={`square ${isDark ? "dark" : "light"} ${
          isSelected ? "selected" : ""
        }`}
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
