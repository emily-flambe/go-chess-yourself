import React, { useState } from "react";
import Piece from "./Piece";
import "../styles/Chessboard.css";

const Chessboard = ({ chessboard, onChessboardUpdate }) => {
  const [selectedSquare, setSelectedSquare] = useState(null); // Square containing the piece to move
  const [targetSquare, setTargetSquare] = useState(null); // Target square for the move

  const handleSquareClick = (row, col) => {
    const clickedPiece = chessboard[row][col];

    // If the user clicks the starting square, cancel the selection
    if (selectedSquare && row === selectedSquare[0] && col === selectedSquare[1]) {
      setSelectedSquare(null);
      setTargetSquare(null);
      return; // Exit early
    }

    if (selectedSquare && targetSquare) {
      // Check if the user is clicking the target square again to confirm the move
      if (row === targetSquare[0] && col === targetSquare[1]) {
        const [selectedRow, selectedCol] = selectedSquare;
        const selectedPiece = chessboard[selectedRow][selectedCol];
        const targetPiece = chessboard[row][col];

        // Allow capturing only opposing pieces
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

          // Update chessboard state and reset selection
          onChessboardUpdate(updatedChessboard);
        }

        // Reset selection after move attempt
        setSelectedSquare(null);
        setTargetSquare(null);
      } else {
        // Update the target square if the user clicks a different square
        setTargetSquare([row, col]);
      }
    } else if (selectedSquare) {
      // Target square selection: Update the target
      const [selectedRow, selectedCol] = selectedSquare;
      const selectedPiece = chessboard[selectedRow][selectedCol];

      // Prevent selecting a square with a piece of the same color
      if (clickedPiece && clickedPiece.color === selectedPiece.color) {
        return; // Do nothing if the piece is of the same color
      }

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
