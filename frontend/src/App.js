import React, { useState } from "react";
import Chessboard from "./components/Chessboard";
import "./styles/App.css";


const App = () => {
  const initialBoard = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, { type: "Rook", color: "White" }, null, null, null, null, null],
    [null, null, null, { type: "King", color: "White" }, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, { type: "Bishop", color: "Black" }, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];

  const [history, setHistory] = useState([initialBoard]); // Immutable history of game states
  const [historyIndex, setHistoryIndex] = useState(0); // Current position in history

  const currentBoard = history[historyIndex]; // Current board state

  const handleMove = (newBoard) => {
    // Append the new board state to the history
    setHistory([...history, newBoard]);
    setHistoryIndex(history.length); // Move to the latest state
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

  return (
    <div className="app-container">
      <h1>Chess Game</h1>
      <Chessboard chessboard={currentBoard} onChessboardUpdate={handleMove} />
      <div className="controls">
        <button onClick={handleBack} disabled={historyIndex === 0}>
          Back
        </button>
        <button onClick={handleForward} disabled={historyIndex === history.length - 1}>
          Forward
        </button>
      </div>
    </div>
  );
};

export default App;
