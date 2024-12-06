// Chessboard.js

import React, { useState } from "react";
import Piece from "./Piece";
import "../styles/Chessboard.css";
import { kingMoves, rookMoves, bishopMoves, queenMoves, knightMoves, pawnMoves, getSquaresThreatenedByColor } from "./Movesets";

const Chessboard = ({ chessboard, onChessboardUpdate, currentTurn, lastMove }) => {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validTargets, setValidTargets] = useState([]);
  const [targetSquare, setTargetSquare] = useState(null);

  const opponentColor = currentTurn === "White" ? "Black" : "White";

  // Squares with opponent pieces threatened by current player (highlight in blue)
  const threatenedByCurrentPlayer = getSquaresThreatenedByColor(chessboard, currentTurn);

  // Squares with current player's pieces threatened by opponent (highlight in red)
  const threatenedByOpponent = getSquaresThreatenedByColor(chessboard, opponentColor);

  const handleSquareClick = (row, col) => {
    const clickedPiece = chessboard[row][col];

    // Ensure only the current player's pieces can be selected
    if (!selectedSquare && clickedPiece && clickedPiece.color !== currentTurn) {
      return;
    }

    // Deselect if clicking the same square
    if (selectedSquare && row === selectedSquare[0] && col === selectedSquare[1]) {
      setSelectedSquare(null);
      setValidTargets([]);
      setTargetSquare(null);
      return;
    }

    // If a target square is selected and clicked again, confirm move
    if (targetSquare && row === targetSquare[0] && col === targetSquare[1]) {
      const [selectedRow, selectedCol] = selectedSquare;
      const selectedPiece = chessboard[selectedRow][selectedCol];

      const updatedChessboard = chessboard.map((r, rowIndex) =>
        r.map((c, colIndex) => {
          if (rowIndex === row && colIndex === col) {
            return selectedPiece;
          } else if (rowIndex === selectedRow && colIndex === selectedCol) {
            return null;
          }
          return c;
        })
      );

      onChessboardUpdate(updatedChessboard, {
        from: [selectedRow, selectedCol],
        to: [row, col],
        piece: selectedPiece,
      });

      setSelectedSquare(null);
      setValidTargets([]);
      setTargetSquare(null);
      return;
    }

    // If a piece is already selected, choose a target square
    if (selectedSquare) {
      if (validTargets.some(([r, c]) => r === row && c === col)) {
        setTargetSquare([row, col]);
      }
      return;
    }

    // Select a piece and calculate valid targets
    if (clickedPiece) {
      setSelectedSquare([row, col]);
      let moves = [];
      switch (clickedPiece.type) {
        case "King":
          moves = kingMoves(row, col, chessboard);
          break;
        case "Rook":
          moves = rookMoves(row, col, chessboard);
          break;
        case "Bishop":
          moves = bishopMoves(row, col, chessboard);
          break;
        case "Queen":
          moves = queenMoves(row, col, chessboard);
          break;
        case "Knight":
          moves = knightMoves(row, col, chessboard);
          break;
        case "Pawn":
          moves = pawnMoves(row, col, chessboard, clickedPiece.color, lastMove);
          break;
        default:
          moves = [];
          break;
      }
      setValidTargets(moves);
      setTargetSquare(null);
    }
  };

  const renderSquare = (row, col) => {
    const piece = chessboard[row][col];
    const isDark = (row + col) % 2 === 1;
    const isSelected = selectedSquare?.[0] === row && selectedSquare?.[1] === col;
    const isValidTarget = validTargets.some(([r, c]) => r === row && c === col);
    const isTargetSquare = targetSquare?.[0] === row && targetSquare?.[1] === col;

    // Determine highlight color based on threat sets:
    // - threatenedByOpponent: current player's pieces threatened by opponent => highlight red
    // - threatenedByCurrentPlayer: opponent's pieces threatened by current player => highlight blue

    let highlightClass = "";
    if (piece) {
      const pos = [row, col];
      const isThreatenedByOpponent = threatenedByOpponent.some(
        ([r, c]) => r === row && c === col
      );
      const isThreatenedByCurrent = threatenedByCurrentPlayer.some(
        ([r, c]) => r === row && c === col
      );

      // If it's White's turn:
      // White threatened by black = red
      // Black threatened by white = blue
      // If it's Black's turn:
      // Black threatened by white = red
      // White threatened by black = blue

      if (currentTurn === "White") {
        if (isThreatenedByOpponent && piece.color === "White") highlightClass = "threat-red";
        if (isThreatenedByCurrent && piece.color === "Black") highlightClass = "threat-blue";
      } else {
        // currentTurn === "Black"
        if (isThreatenedByOpponent && piece.color === "Black") highlightClass = "threat-red";
        if (isThreatenedByCurrent && piece.color === "White") highlightClass = "threat-blue";
      }
    }

    return (
      <div
        key={`${row}-${col}`}
        className={`square ${isDark ? "dark" : "light"} ${isSelected ? "selected" : ""} ${isTargetSquare ? "target" : ""} ${highlightClass}`}
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
