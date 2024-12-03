export const kingMoves = (row, col, board) => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1], // Top-left, Top, Top-right
      [0, -1],          [0, 1],   // Left, Right
      [1, -1], [1, 0], [1, 1],   // Bottom-left, Bottom, Bottom-right
    ];
  
    return calculateMoves(row, col, directions, board, 1); // Max 1 step in each direction
  };
  
  export const rookMoves = (row, col, board) => {
    const directions = [
      [-1, 0], [1, 0],  // Vertical (Up, Down)
      [0, -1], [0, 1],  // Horizontal (Left, Right)
    ];
  
    return calculateMoves(row, col, directions, board);
  };
  
  export const bishopMoves = (row, col, board) => {
    const directions = [
      [-1, -1], [-1, 1], // Diagonals
      [1, -1], [1, 1],
    ];
  
    return calculateMoves(row, col, directions, board);
  };
  
  export const queenMoves = (row, col, board) => {
    const directions = [
      [-1, -1], [-1, 0], [-1, 1], // Top-left, Top, Top-right
      [0, -1],          [0, 1],   // Left, Right
      [1, -1], [1, 0], [1, 1],   // Bottom-left, Bottom, Bottom-right
    ];
  
    return calculateMoves(row, col, directions, board); // Unlimited in all directions
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
  
  export const pawnMoves = (row, col, board, color) => {
    const direction = color === "White" ? -1 : 1; // White moves up, Black moves down
    const moves = [];
  
    // Forward move
    if (board[row + direction]?.[col] === null) {
      moves.push([row + direction, col]);
  
      // Double move on first move
      if ((color === "White" && row === 6) || (color === "Black" && row === 1)) {
        if (board[row + 2 * direction]?.[col] === null) {
          moves.push([row + 2 * direction, col]);
        }
      }
    }
  
    // Captures
    if (board[row + direction]?.[col - 1]?.color !== color) {
      moves.push([row + direction, col - 1]);
    }
    if (board[row + direction]?.[col + 1]?.color !== color) {
      moves.push([row + direction, col + 1]);
    }
  
    return filterMoves(moves, board);
  };
  
  const calculateMoves = (row, col, directions, board, maxSteps = Infinity) => {
    const moves = [];
  
    for (const [dRow, dCol] of directions) {
      let steps = 0;
      let r = row + dRow;
      let c = col + dCol;
  
      while (steps < maxSteps && r >= 0 && r < 8 && c >= 0 && c < 8) {
        const target = board[r][c];
        if (target) {
          if (target.color !== board[row][col].color) moves.push([r, c]); // Capture
          break; // Stop at first piece
        }
        moves.push([r, c]);
        r += dRow;
        c += dCol;
        steps++;
      }
    }
  
    return moves;
  };
  
  const filterMoves = (moves, board) => {
    return moves.filter(([r, c]) => r >= 0 && r < 8 && c >= 0 && c < 8);
  };
  