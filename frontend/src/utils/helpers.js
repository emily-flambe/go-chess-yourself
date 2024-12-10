// helpers.js

/**
 * Determines the castling rights for a given board state.
 * @param {Array} board - The current chessboard state
 * @returns {Object} castlingRights - An object with castling rights for each side
 */
export function determineCastlingRights(board) {
    const castlingRights = {
      whiteKingside: false,
      whiteQueenside: false,
      blackKingside: false,
      blackQueenside: false,
    };
  
    // Check for White's castling conditions
    const whiteKingRow = 7;
    const whiteKingsideClear = !board[whiteKingRow][5] && !board[whiteKingRow][6];
    const whiteQueensideClear = !board[whiteKingRow][1] && !board[whiteKingRow][2] && !board[whiteKingRow][3];
  
    if (whiteKingsideClear) castlingRights.whiteKingside = true;
    if (whiteQueensideClear) castlingRights.whiteQueenside = true;
  
    // Check for Black's castling conditions
    const blackKingRow = 0;
    const blackKingsideClear = !board[blackKingRow][5] && !board[blackKingRow][6];
    const blackQueensideClear = !board[blackKingRow][1] && !board[blackKingRow][2] && !board[blackKingRow][3];
  
    if (blackKingsideClear) castlingRights.blackKingside = true;
    if (blackQueensideClear) castlingRights.blackQueenside = true;
  
    return castlingRights;
  }
  