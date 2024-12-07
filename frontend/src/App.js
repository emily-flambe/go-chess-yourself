import React, { useState } from "react";
import Chessboard from "./components/Chessboard";
import "./styles/App.css";

const App = () => {
  const initialBoard = [
    [{ type: "Rook", color: "Black" }, { type: "Knight", color: "Black" }, { type: "Bishop", color: "Black" }, { type: "Queen", color: "Black" }, { type: "King", color: "Black" }, { type: "Bishop", color: "Black" }, { type: "Knight", color: "Black" }, { type: "Rook", color: "Black" }],
    [{ type: "Pawn", color: "Black" }, { type: "Pawn", color: "Black" }, { type: "Pawn", color: "Black" }, { type: "Pawn", color: "Black" }, { type: "Pawn", color: "Black" }, { type: "Pawn", color: "Black" }, { type: "Pawn", color: "Black" }, { type: "Pawn", color: "Black" }],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [{ type: "Pawn", color: "White" }, { type: "Pawn", color: "White" }, { type: "Pawn", color: "White" }, { type: "Pawn", color: "White" }, { type: "Pawn", color: "White" }, { type: "Pawn", color: "White" }, { type: "Pawn", color: "White" }, { type: "Pawn", color: "White" }],
    [{ type: "Rook", color: "White" }, { type: "Knight", color: "White" }, { type: "Bishop", color: "White" }, { type: "Queen", color: "White" }, { type: "King", color: "White" }, { type: "Bishop", color: "White" }, { type: "Knight", color: "White" }, { type: "Rook", color: "White" }],
  ];

  const [history, setHistory] = useState([initialBoard]); // Immutable history of game states
  const [historyIndex, setHistoryIndex] = useState(0);   // Current position in history
  const [lastMove, setLastMove] = useState(null);        // Track the last move
  const [currentTurn, setCurrentTurn] = useState("White");// Track whose turn it is
  const [branches, setBranches] = useState([]);          // Store entire timelines (not just future states)

  const currentBoard = history[historyIndex]; // Current board state

  const handleMove = (newBoard, moveDetails) => {
    // If we are not at the end of the current history, the user is branching from a past state
    if (historyIndex < history.length - 1) {
      // Save the entire current timeline into branches before altering it
      setBranches([...branches, history]);

      // Truncate history to current position and then append the new move
      const newHistory = history.slice(0, historyIndex + 1).concat([newBoard]);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    } else {
      // Normal move at the end of history
      setHistory([...history, newBoard]);
      setHistoryIndex(history.length);
    }

    setLastMove(moveDetails);
    setCurrentTurn(currentTurn === "White" ? "Black" : "White");
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1); // Step back in history
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1); // Step forward in history
    }
  };

  const handleReset = () => {
    setHistory([initialBoard]);
    setHistoryIndex(0);
    setLastMove(null);
    setCurrentTurn("White");
    setBranches([]);
  };

  return (
    <div className="app-container">
      <h1>Chess Game</h1>
      <Chessboard
        chessboard={currentBoard}
        onChessboardUpdate={handleMove}
        currentTurn={currentTurn}
        lastMove={lastMove}
      />
      <div className="controls">
        <button onClick={handleBack} disabled={historyIndex === 0}>
          Back
        </button>
        <button onClick={handleForward} disabled={historyIndex === history.length - 1}>
          Forward
        </button>
        <button onClick={handleReset}>Reset</button>
      </div>
    </div>
  );
};

export default App;
