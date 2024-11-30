import React from "react";
import "../styles/Piece.css";

const Piece = ({ type, color }) => {
  return (
    <div
      className={`piece ${color.toLowerCase()}`}
      title={`${color} ${type}`} // Tooltip for accessibility
    >
      {type[0]} {/* Show the first letter of the piece type */}
    </div>
  );
};

export default Piece;
