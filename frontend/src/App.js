import React, { useState } from "react";
import Chessboard from "./components/Chessboard";

const App = () => {
  // Chessboard state: 8x8 grid with two Kings
  const [chessboard, setChessboard] = useState([
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, { type: "Rook", color: "White" }, null, null, null, null],
    [null, null, null, null, null, { type: "King", color: "White" }, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ]);

  return (
    <div>
      <h1>Chess Game</h1>
      <Chessboard chessboard={chessboard} onChessboardUpdate={setChessboard} />
    </div>
  );
};

export default App;
