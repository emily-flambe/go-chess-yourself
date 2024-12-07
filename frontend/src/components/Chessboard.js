import React, { useState } from "react";
import Piece from "./Piece";
import "../styles/Chessboard.css";
import { kingMoves, rookMoves, bishopMoves, queenMoves, knightMoves, pawnMoves, getSquaresThreatenedByColor } from "./Movesets";

const Chessboard = ({ chessboard, onChessboardUpdate, currentTurn, lastMove }) => {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validTargets, setValidTargets] = useState([]);
  const [targetSquare, setTargetSquare] = useState(null);

  const opponentColor = currentTurn === "White" ? "Black" : "White";

  // Get squares threatened by current player's pieces (opponent’s pieces at risk)
  const threatenedByCurrentPlayer = getSquaresThreatenedByColor(chessboard, currentTurn);

  // Get squares where current player's pieces are threatened by opponent
  const threatenedByOpponent = getSquaresThreatenedByColor(chessboard, opponentColor);

  const handleSquareClick = (row, col) => {
    const clickedPiece = chessboard[row][col];

    // Ensure only current player's pieces can be selected if no piece is currently selected
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

    // If a target square is selected and clicked again, confirm the move
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

      // Filter moves that keep the King safe
      moves = filterKingSafeMoves(chessboard, [row, col], clickedPiece, moves, currentTurn);

      setValidTargets(moves);
      setTargetSquare(null);
    }
  };

  // Filter out moves that would leave the king threatened
  const filterKingSafeMoves = (board, fromPos, piece, moves, playerColor) => {
    return moves.filter(([targetRow, targetCol]) => {
      const simulatedBoard = simulateMove(board, fromPos, [targetRow, targetCol], piece);
      const kingPos = findKingPosition(playerColor, simulatedBoard);
      if (!kingPos) return false; // no king found, shouldn't happen but just in case

      // If after the move, the king's square is threatened by opponent, discard this move
      const opponentColor = playerColor === "White" ? "Black" : "White";
      const squaresThreatenedByOpponent = getSquaresThreatenedByColor(simulatedBoard, opponentColor);

      const kingUnderThreat = squaresThreatenedByOpponent.some(
        ([r, c]) => r === kingPos.row && c === kingPos.col
      );

      return !kingUnderThreat;
    });
  };

  const findKingPosition = (playerColor, board) => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = board[r][c];
        if (piece && piece.type === "King" && piece.color === playerColor) {
          return { row: r, col: c };
        }
      }
    }
    return null;
  };

  const simulateMove = (board, fromPos, toPos, piece) => {
    const [fromRow, fromCol] = fromPos;
    const [toRow, toCol] = toPos;

    return board.map((r, rowIndex) =>
      r.map((cell, colIndex) => {
        if (rowIndex === toRow && colIndex === toCol) {
          return piece;
        } else if (rowIndex === fromRow && colIndex === fromCol) {
          return null;
        }
        return cell;
      })
    );
  };

  const renderSquare = (row, col) => {
    const piece = chessboard[row][col];
    const isDark = (row + col) % 2 === 1;
    const isSelected = selectedSquare?.[0] === row && selectedSquare?.[1] === col;
    const isValidTarget = validTargets.some(([r, c]) => r === row && c === col);
    const isTargetSquare = targetSquare?.[0] === row && targetSquare?.[1] === col;

    // Determine highlight color based on threat sets
    const isThreatenedByOpponent = threatenedByOpponent.some(([r, c]) => r === row && c === col);
    const isThreatenedByCurrent = threatenedByCurrentPlayer.some(([r, c]) => r === row && c === col);

    let highlightClass = "";
    if (piece) {
      if (currentTurn === "White") {
        // White's threatened pieces: red highlight
        if (isThreatenedByOpponent && piece.color === "White") highlightClass = "threat-red";
        // Black's threatened pieces: blue highlight
        if (isThreatenedByCurrent && piece.color === "Black") highlightClass = "threat-blue";
      } else {
        // currentTurn = Black
        // Black's threatened pieces: red highlight
        if (isThreatenedByOpponent && piece.color === "Black") highlightClass = "threat-red";
        // White's threatened pieces: blue highlight
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
