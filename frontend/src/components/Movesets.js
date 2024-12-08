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
  
    // Forward moves
    if (board[row + direction]?.[col] === null) {
      moves.push([row + direction, col]);
      if ((color === "White" && row === 6) || (color === "Black" && row === 1)) {
        if (board[row + 2 * direction]?.[col] === null) {
          moves.push([row + 2 * direction, col]);
        }
      }
    }
  
    // Diagonal captures
    if (board[row + direction]?.[col - 1] && board[row + direction][col - 1].color !== color) {
      moves.push([row + direction, col - 1]);
    }
    if (board[row + direction]?.[col + 1] && board[row + direction][col + 1].color !== color) {
      moves.push([row + direction, col + 1]);
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
  