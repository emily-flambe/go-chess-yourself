import React, { useState } from "react";
import Piece from "./Piece";
import "../styles/Chessboard.css";
import { kingMoves, rookMoves, bishopMoves, queenMoves, knightMoves, pawnMoves, getSquaresThreatenedByColor, calculateValidTargetsForPiece } from "./Movesets";

const Chessboard = ({ chessboard, onChessboardUpdate, currentTurn, lastMove, showThreats, showCaptures, winner, losingKingPos }) => {
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [validTargets, setValidTargets] = useState([]);
  const [targetSquare, setTargetSquare] = useState(null);

  const opponentColor = currentTurn === "White" ? "Black" : "White";

  // If there's a winner, skip highlight logic. Otherwise, calculate threatened squares.
  const threatenedByCurrentPlayer = !winner ? getSquaresThreatenedByColor(chessboard, currentTurn) : [];
  const threatenedByOpponent = !winner ? getSquaresThreatenedByColor(chessboard, opponentColor) : [];

  const handleSquareClick = (row, col) => {
    if (winner) return; // If there's a winner, no moves allowed

    const clickedPiece = chessboard[row][col];

    if (!selectedSquare && clickedPiece && clickedPiece.color !== currentTurn) {
      return;
    }

    if (selectedSquare && row === selectedSquare[0] && col === selectedSquare[1]) {
      setSelectedSquare(null);
      setValidTargets([]);
      setTargetSquare(null);
      return;
    }

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

      const targetPiece = chessboard[row][col]; // piece on the target square before the move
      const moveDetails = {
        from: [selectedRow, selectedCol],
        to: [row, col],
        piece: selectedPiece,
        capturedPiece: targetPiece && targetPiece.color !== selectedPiece.color ? targetPiece : null
      };

      onChessboardUpdate(updatedChessboard, moveDetails);

      setSelectedSquare(null);
      setValidTargets([]);
      setTargetSquare(null);
      return;
    }

    if (selectedSquare) {
      if (validTargets.some(([r, c]) => r === row && c === col)) {
        setTargetSquare([row, col]);
      }
      return;
    }

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

      moves = filterKingSafeMoves(chessboard, [row, col], clickedPiece, moves, currentTurn);

      setValidTargets(moves);
      setTargetSquare(null);
    }
  };

  const filterKingSafeMoves = (board, fromPos, piece, moves, playerColor) => {
    return moves.filter(([targetRow, targetCol]) => {
      const simulatedBoard = simulateMove(board, fromPos, [targetRow, targetCol], piece);
      const kingPos = findKingPosition(playerColor, simulatedBoard);
      if (!kingPos) return false;

      const opponentColor = playerColor === "White" ? "Black" : "White";
      const squaresThreatenedByOpponent = getSquaresThreatenedByColor(simulatedBoard, opponentColor);

      const kingUnderThreat = squaresThreatenedByOpponent.some(
        ([r, c]) => r === kingPos.row && c === kingPos.col
      );

      return !kingUnderThreat;
    });
  };

  const renderSquare = (row, col) => {
    const piece = chessboard[row][col];
    const isDark = (row + col) % 2 === 1;
    const isSelected = selectedSquare?.[0] === row && selectedSquare?.[1] === col;
    const isValidTarget = validTargets.some(([r, c]) => r === row && c === col);
    const isTargetSquare = targetSquare?.[0] === row && targetSquare?.[1] === col;

    let highlightClass = "";
    // Only apply highlighting if no winner
    if (!winner && piece) {
      const isThreatenedByOpponent = threatenedByOpponent.some(([r, c]) => r === row && c === col);
      const isThreatenedByCurrent = threatenedByCurrentPlayer.some(([r, c]) => r === row && c === col);

      if (currentTurn === "White") {
        if (isThreatenedByOpponent && piece.color === "White" && showThreats) highlightClass = "threat-red";
        if (isThreatenedByCurrent && piece.color === "Black" && showCaptures) highlightClass = "threat-blue";
      } else {
        if (isThreatenedByOpponent && piece.color === "Black" && showThreats) highlightClass = "threat-red";
        if (isThreatenedByCurrent && piece.color === "White" && showCaptures) highlightClass = "threat-blue";
      }
    }

    const isLosingKingSquare = winner && losingKingPos && losingKingPos.row === row && losingKingPos.col === col;

    return (
      <div
        key={`${row}-${col}`}
        className={`square ${isDark ? "dark" : "light"} ${isSelected ? "selected" : ""} ${isTargetSquare ? "target" : ""} ${highlightClass}`}
        onClick={() => handleSquareClick(row, col)}
        style={{ position: "relative" }}
      >
        {piece && <Piece type={piece.type} color={piece.color} />}
        {isValidTarget && <div className="dot"></div>}
        {isLosingKingSquare && (
          <div 
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "48px",
              fontWeight: "bold",
              color: "red",
              pointerEvents: "none",
            }}
          >
            X
          </div>
        )}
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

// Helper functions defined outside the component:
function findKingPosition(playerColor, board) {
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece.type === "King" && piece.color === playerColor) {
        return { row: r, col: c };
      }
    }
  }
  return null;
}

function simulateMove(board, fromPos, toPos, piece) {
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
}

function generateAllValidMovesForPlayer(playerColor, board) {
  const allMoves = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const piece = board[row][col];
      if (piece && piece.color === playerColor) {
        const moves = calculateValidTargetsForPiece(row, col, piece, board);
        moves.forEach(([toRow, toCol]) => {
          allMoves.push({
            from: { row, col },
            to: { row: toRow, col: toCol },
            piece
          });
        });
      }
    }
  }
  return allMoves;
}

function isCheckmate(playerColor, board) {
  const opponentColor = playerColor === "White" ? "Black" : "White";
  const kingPos = findKingPosition(playerColor, board);
  if (!kingPos) {
    return true; 
  }

  const opponentThreats = getSquaresThreatenedByColor(board, opponentColor);
  const kingUnderThreat = opponentThreats.some(([r, c]) => r === kingPos.row && c === kingPos.col);

  if (!kingUnderThreat) {
    return false;
  }

  const allMoves = generateAllValidMovesForPlayer(playerColor, board);
  for (const move of allMoves) {
    const { from, to, piece } = move;
    const simulatedBoard = simulateMove(board, [from.row, from.col], [to.row, to.col], piece);

    const newKingPos = findKingPosition(playerColor, simulatedBoard);
    if (!newKingPos) continue;

    const newOpponentThreats = getSquaresThreatenedByColor(simulatedBoard, opponentColor);
    const kingStillThreatened = newOpponentThreats.some(([r, c]) => r === newKingPos.row && c === newKingPos.col);

    if (!kingStillThreatened) {
      return false;
    }
  }

  return true;
}

export { isCheckmate };

export default Chessboard;
