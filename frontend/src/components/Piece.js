import React from "react";
import "../styles/Piece.css";

const Piece = ({ type, color }) => {
    // Determine the display character - N is for kNight, otherwise use the first letter
    const displayLetter = type === "Knight" ? "N" : type[0];
  
    return (
      <div
        className={`piece ${color.toLowerCase()}`}
        title={`${color} ${type}`} // Tooltip for accessibility
      >
        {displayLetter}
      </div>
    );
  };
  
  export default Piece;
  