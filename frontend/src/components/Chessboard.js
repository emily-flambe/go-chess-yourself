import React from "react";
import Piece from "./Piece";
import "../styles/Chessboard.css";

const Chessboard = ({ chessboard }) => {
  // Render a single square of the chessboard
  const renderSquare = (row, col) => {
    const piece = chessboard[row][col];
    return (
      <div key={`${row}-${col}`} className="square">
        {piece && <Piece type={piece.type} color={piece.color} />}
      </div>
    );
  };

  // Render the entire chessboard
  return (
    <div className="chessboard">
      {chessboard.map((row, rowIndex) => (
        <div key={rowIndex} className="row">
          {row.map((_, colIndex) => renderSquare(rowIndex, colIndex))}
        </div>
      ))}
    </div>
  );
};

export default Chessboard;
