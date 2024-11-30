import React from "react";
import Piece from "./Piece";
import "../styles/Chessboard.css";

const Chessboard = ({ chessboard }) => {
  // Render a single square of the chessboard
  const renderSquare = (row, col) => {
    const isDark = (row + col) % 2 === 1; // Alternate colors
    const piece = chessboard[row][col];

    return (
      <div
        key={`${row}-${col}`}
        className={`square ${isDark ? "dark" : "light"}`}
      >
        {piece && <Piece type={piece.type} color={piece.color} />}
      </div>
    );
  };

  // Render the entire chessboard
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
