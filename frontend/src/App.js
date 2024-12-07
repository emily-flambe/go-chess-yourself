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

  const [history, setHistory] = useState([initialBoard]); 
  const [historyIndex, setHistoryIndex] = useState(0);  
  const [lastMove, setLastMove] = useState(null);        
  const [currentTurn, setCurrentTurn] = useState("White");
  const [branches, setBranches] = useState([]);

  const currentBoard = history[historyIndex];

  const handleMove = (newBoard, moveDetails) => {
    if (historyIndex < history.length - 1) {
      // Save entire current timeline
      setBranches([...branches, history]);

      // Truncate history and add new move
      const newHistory = history.slice(0, historyIndex + 1).concat([newBoard]);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    } else {
      // Normal move
      setHistory([...history, newBoard]);
      setHistoryIndex(history.length);
    }

    setLastMove(moveDetails);
    setCurrentTurn(currentTurn === "White" ? "Black" : "White");
  };

  const handleBack = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleForward = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
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
      <div className="turn-indicator" style={{
        backgroundColor: currentTurn === "White" ? "#fff" : "#000",
        color: currentTurn === "White" ? "#000" : "#fff",
        padding: "10px",
        display: "inline-block",
        marginBottom: "20px",
        borderRadius: "5px"
      }}>
        {currentTurn.toLowerCase()} to move
      </div>
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
