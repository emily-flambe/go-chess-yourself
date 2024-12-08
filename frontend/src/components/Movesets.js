// Movesets.js

export const kingMoves = (row, col, board) => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],           [0, 1],
      [1, -1], [1, 0], [1, 1],
    ];
    return calculateMoves(row, col, directions, board, 1);
  };
  
  export const rookMoves = (row, col, board) => {
    const directions = [
      [-1, 0], [1, 0],
      [0, -1], [0, 1],
    ];
    return calculateMoves(row, col, directions, board);
  };
  
  export const bishopMoves = (row, col, board) => {
    const directions = [
      [-1, -1], [-1, 1],
      [1, -1], [1, 1],
    ];
    return calculateMoves(row, col, directions, board);
  };
  
  export const queenMoves = (row, col, board) => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1],
      [0, -1],            [0, 1],
      [1, -1], [1, 0], [1, 1],
    ];
    return calculateMoves(row, col, directions, board);
  };
  
  export const knightMoves = (row, col, board) => {
    const moves = [
      [row + 2, col + 1], [row + 2, col - 1],
      [row - 2, col + 1], [row - 2, col - 1],
      [row + 1, col + 2], [row + 1, col - 2],
      [row - 1, col + 2], [row - 1, col - 2],
    ];
    return filterMoves(moves, board);
  };
  
  export const pawnMoves = (row, col, board, color, lastMove) => {
    const direction = color === "White" ? -1 : 1;
    const moves = [];
  
    // Normal forward moves
    if (board[row + direction]?.[col] === null) {
      moves.push([row + direction, col]);
      if ((color === "White" && row === 6) || (color === "Black" && row === 1)) {
        if (board[row + 2 * direction]?.[col] === null) {
          moves.push([row + 2 * direction, col]);
        }
      }
    }
  
    // Diagonal captures
    if (
      board[row + direction]?.[col - 1] &&
      board[row + direction][col - 1].color !== color
    ) {
      moves.push([row + direction, col - 1]);
    }
    if (
      board[row + direction]?.[col + 1] &&
      board[row + direction][col + 1].color !== color
    ) {
      moves.push([row + direction, col + 1]);
    }
  
    // En passant logic:
    // Check if lastMove was a two-square pawn move
    if (lastMove && lastMove.piece.type === "Pawn") {
      const [fromRow, fromCol] = lastMove.from;
      const [toRow, toCol] = lastMove.to;
      // A two-square pawn move means difference in rows is 2
      if (Math.abs(fromRow - toRow) === 2) {
        // The opponent's pawn just made a two-square move to 'toRow,toCol'
        // Determine if our pawn can capture it en passant.
  
        // For White to capture en passant:
        // Black's pawn moved from row 1 to row 3. White pawn must be on row 3 and next to that file:
        // White can capture on row 2, same col as black pawn.
        //
        // For Black to capture en passant:
        // White's pawn moved from row 6 to row 4. Black pawn must be on row 4 and next to that file:
        // Black can capture on row 5, same col as white pawn.
  
        const oppColor = color === "White" ? "Black" : "White";
        // Double-step was made by opponent
        if (lastMove.piece.color === oppColor) {
          // The column where the opponent’s pawn ended up
          const doubleStepCol = toCol;
  
          // Check if our pawn is in position to capture en passant
          // White capturing en passant: our pawn must be on row 3 if black just did two-step
          // Black capturing en passant: our pawn must be on row 4 if white just did two-step
  
          // If white, opponent (black) double step = from row 1 to row 3
          // White's pawn must be on row 3 and adjacent column to doubleStepCol to capture on row 2
          // If black, opponent (white) double step = from row 6 to row 4
          // Black's pawn must be on row 4 and adjacent column to doubleStepCol to capture on row 5
  
          let enPassantTargetRow;
          let requiredRow; 
          if (color === "White") {
            // Opponent is Black, so black moved from row 1 to row 3
            // White pawn must be on row 3 to capture
            requiredRow = 3; 
            enPassantTargetRow = 2; // White captures downwards (row-1) from row 3
          } else {
            // color === "Black"
            // Opponent is White, white moved from row 6 to row 4
            // Black pawn must be on row 4 to capture
            requiredRow = 4;
            enPassantTargetRow = 5; // Black captures upwards (row+1) from row 4
          }
  
          // Check if our pawn is on the correct row and adjacent column
          if (row === requiredRow && Math.abs(col - doubleStepCol) === 1) {
            // Add the en passant capture square
            moves.push([enPassantTargetRow, doubleStepCol]);
          }
        }
      }
    }
  
    return filterMoves(moves, board);
  };
  
  
  export const calculateValidTargetsForPiece = (row, col, piece, board) => {
    switch (piece.type) {
      case "King":
        return kingMoves(row, col, board);
      case "Rook":
        return rookMoves(row, col, board);
      case "Bishop":
        return bishopMoves(row, col, board);
      case "Queen":
        return queenMoves(row, col, board);
      case "Knight":
        return knightMoves(row, col, board);
      case "Pawn":
        return pawnMoves(row, col, board, piece.color, null); // Modify if needed for en passant
      default:
        return [];
    }
  };
  
  // Returns squares with pieces of the opposite color that `attackingColor` can capture.
  export const getSquaresThreatenedByColor = (board, attackingColor) => {
    const threatened = [];
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row][col];
        if (piece && piece.color === attackingColor) {
          const moves = calculateValidTargetsForPiece(row, col, piece, board);
          moves.forEach(([r, c]) => {
            const targetPiece = board[r][c];
            if (targetPiece && targetPiece.color !== attackingColor) {
              threatened.push([r, c]);
            }
          });
        }
      }
    }
    return threatened;
  };
  
  const calculateMoves = (row, col, directions, board, maxSteps = Infinity) => {
    const moves = [];
    const piece = board[row][col];
  
    for (const [dRow, dCol] of directions) {
      let steps = 0;
      let r = row + dRow;
      let c = col + dCol;
  
      while (steps < maxSteps && r >= 0 && r < 8 && c >= 0 && c < 8) {
        const target = board[r][c];
        if (target) {
          if (target.color !== piece.color) moves.push([r, c]); // capture
          break;
        }
        moves.push([r, c]);
        r += dRow;
        c += dCol;
        steps++;
      }
    }
  
    return moves;
  };
  
  const filterMoves = (moves, board) =>
    moves.filter(([r, c]) => r >= 0 && r < 8 && c >= 0 && c < 8);
  
  export function findKingPosition(playerColor, board) {
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
  