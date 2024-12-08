import React, { useState } from "react";
import Chessboard from "./components/Chessboard";
import "./styles/App.css";
import { isCheckmate } from "./components/Chessboard";
import { getMoveNotation } from './components/Notation';


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
  const [showThreats, setShowThreats] = useState(true);   
  const [showCaptures, setShowCaptures] = useState(true); 
  const [winner, setWinner] = useState(null); 
  const [losingKingPos, setLosingKingPos] = useState(null);

  const [moves, setMoves] = useState([]);

  const currentBoard = history[historyIndex];

  const handleMove = (newBoard, moveDetails) => {
    if (historyIndex < history.length - 1) {
      setBranches([...branches, history]);
      const newHistory = history.slice(0, historyIndex + 1).concat([newBoard]);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
    } else {
      setHistory([...history, newBoard]);
      setHistoryIndex(history.length);
    }

    setLastMove(moveDetails);

    const nextTurn = currentTurn === "White" ? "Black" : "White";
    setCurrentTurn(nextTurn);

    if (isCheckmate(nextTurn, newBoard)) {
      const winnerColor = nextTurn === "White" ? "Black" : "White";
      setWinner(winnerColor);
      // Find losing king's position
      const losingColor = nextTurn; // nextTurn player is the one checkmated
      const kingPos = findKingPosition(losingColor, newBoard);
      setLosingKingPos(kingPos);
    }

    const notation = getMoveNotation(moveDetails);
    setMoves([...moves, notation]);

    console.log('Move notation:', notation);
    
  };

  const handleBack = () => {
    // Keep Back available even if winner is set
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
    }
  };

  const handleForward = () => {
    // Keep Forward disabled if winner since no new states, 
    // but user only requested Back to remain available
    if (!winner && historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
    }
  };

  const handleReset = () => {
    setHistory([initialBoard]);
    setHistoryIndex(0);
    setLastMove(null);
    setCurrentTurn("White");
    setBranches([]);
    setWinner(null);
    setLosingKingPos(null);
    setMoves([]);
  };

  const toggleShowThreats = () => {
    setShowThreats(!showThreats);
  };

  const toggleShowCaptures = () => {
    setShowCaptures(!showCaptures);
  };

  // Format moves with a line break after every two moves
  // For example: moves = ["e4", "e5", "Nf3", "Nc6"]
  // Display as:
  // e4 e5
  // Nf3 Nc6
  const formattedMoves = [];
  for (let i = 0; i < moves.length; i += 2) {
    const firstMove = moves[i] || '';
    const secondMove = moves[i+1] || '';
    formattedMoves.push((secondMove) ? `${firstMove} ${secondMove}` : firstMove);
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh", // Full viewport height
        width: "100vw", // Full viewport width
        boxSizing: "border-box", // Prevent overflow due to padding/margins
      }}
    >
      <div
        className="app-container"
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start", // Align moves list and chessboard container at the top
        }}
      >
        {/* Moves list on the left */}
        <div
          className="moves-container"
          style={{
            width: "150px",
            marginRight: "20px",
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: "5px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
            maxHeight: "600px", // Limit height to chessboard height
          }}
        >
          {/* Moves go here */}
          {formattedMoves.map((line, index) => (
            <div key={index}>
              {line}
              <br />
            </div>
          ))}
        </div>
  
        {/* Main content area (heading, turn indicator, and chessboard) */}
        <div
          className="main-container"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center", // Centers children horizontally
          }}
        >
          <h1 style={{ marginBottom: "10px", textAlign: "center" }}>Chess Game</h1>
  
          {winner ? (
            <div
              className="turn-indicator"
              style={{
                backgroundColor: winner === "White" ? "#fff" : "#000",
                color: winner === "White" ? "#000" : "#fff",
                padding: "20px",
                display: "inline-block",
                marginBottom: "20px",
                borderRadius: "5px",
                fontSize: "24px",
                fontWeight: "bold",
                textAlign: "center", // Center text
              }}
            >
              {winner.toLowerCase()} wins
            </div>
          ) : (
            <div
              className="turn-indicator"
              style={{
                backgroundColor: currentTurn === "White" ? "#fff" : "#000",
                color: currentTurn === "White" ? "#000" : "#fff",
                padding: "10px",
                display: "inline-block",
                marginBottom: "20px",
                borderRadius: "5px",
                textAlign: "center", // Center text
              }}
            >
              {currentTurn.toLowerCase()} to move
            </div>
          )}
  
          <Chessboard
            chessboard={currentBoard}
            onChessboardUpdate={handleMove}
            currentTurn={currentTurn}
            lastMove={lastMove}
            showThreats={showThreats}
            showCaptures={showCaptures}
            winner={winner}
            losingKingPos={losingKingPos}
          />
  
          <div className="controls" style={{ marginTop: "20px" }}>
            <button onClick={handleBack} disabled={historyIndex === 0}>
              Back
            </button>
            <button
              onClick={handleForward}
              disabled={historyIndex === history.length - 1 || winner}
            >
              Forward
            </button>
            <button onClick={handleReset}>Reset</button>
          </div>
  
          <div className="toggles" style={{ marginTop: "10px" }}>
            <label style={{ marginRight: "10px" }}>
              <input
                type="checkbox"
                checked={showThreats}
                onChange={toggleShowThreats}
                disabled={!!winner} // Disable if winner is declared
              />
              Show Threats
            </label>
            <label>
              <input
                type="checkbox"
                checked={showCaptures}
                onChange={toggleShowCaptures}
                disabled={!!winner} // Disable if winner is declared
              />
              Show Captures
            </label>
          </div>
        </div>
      </div>
    </div>
  );
  }
export default App;
