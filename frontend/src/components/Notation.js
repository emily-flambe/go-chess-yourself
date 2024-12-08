import { getSquaresThreatenedByColor, findKingPosition, calculateValidTargetsForPiece } from './Movesets';

const piecesToNotation = {
  'King': 'K',
  'Queen': 'Q',
  'Rook': 'R',
  'Bishop': 'B',
  'Knight': 'N'
};

/**
 * Converts a move detail object into a simplified chess notation string, including captures, checks, and checkmates.
 * @param {Object} moveDetails - Information about the move
 * @param {Array} moveDetails.from - [fromRow, fromCol]
 * @param {Array} moveDetails.to - [toRow, toCol]
 * @param {Object} moveDetails.piece - { type: string, color: string }
 * @param {Object|null} moveDetails.capturedPiece - The piece captured, or null if no capture
 * @param {Array} chessboard - The current state of the chessboard AFTER the move is made
 * @param {string} currentTurn - The color ("White" or "Black") of the player who just moved
 * @returns {string} notation - The resulting notation (e.g. "Qd5+", "e4", "Nxf3#", "exd4")
 */
export function getMoveNotation(moveDetails, chessboard, currentTurn) {
  const { piece, from, to, capturedPiece } = moveDetails;
  const [toRow, toCol] = to;
  const [fromRow, fromCol] = from;

  // Convert to file and rank
  const file = String.fromCharCode('a'.charCodeAt(0) + toCol);
  const rank = 8 - toRow;

  let notation = '';
  const isCapture = !!capturedPiece;

  if (piece.type === 'Pawn') {
    // Pawns have no letter unless capturing, then use the fromFile letter
    if (isCapture) {
      const fromFile = String.fromCharCode('a'.charCodeAt(0) + fromCol);
      notation += fromFile.toLowerCase() + 'x';
    }
    notation += file + rank;
  } else {
    const pieceLetter = piecesToNotation[piece.type] || '';
    notation += pieceLetter;
    if (isCapture) notation += 'x';
    notation += file + rank;
  }

  // Determine if this move results in check or checkmate
  const opponentColor = piece.color === 'White' ? 'Black' : 'White';
  const opponentKingPos = findKingPosition(opponentColor, chessboard);

  if (opponentKingPos) {
    // Check if the opponent's king is threatened after this move
    const threatenedSquares = getSquaresThreatenedByColor(chessboard, piece.color);
    const kingUnderThreat = threatenedSquares.some(([r, c]) => r === opponentKingPos.row && c === opponentKingPos.col);

    if (kingUnderThreat) {
      // Check if the opponent can make any move to escape
      const canEscape = canOpponentEscape(opponentColor, chessboard, piece.color);
      notation += canEscape ? '+' : '#';
    }
  }

  return notation;
}

/**
 * Helper to simulate a move on the board
 * @param {Array} board 
 * @param {Array} from [fromRow, fromCol]
 * @param {Array} to [toRow, toCol]
 * @param {Object} piece
 * @returns {Array} newBoard - updated board state
 */
function simulateMove(board, from, to, piece) {
  const [fromRow, fromCol] = from;
  const [toRow, toCol] = to;

  return board.map((row, r) =>
    row.map((cell, c) => {
      if (r === toRow && c === toCol) return piece;
      if (r === fromRow && c === fromCol) return null;
      return cell;
    })
  );
}

/**
 * Generate all valid moves for a given player
 * @param {string} playerColor "White" or "Black"
 * @param {Array} board current board state
 * @returns {Array} moves
 */
function getAllValidMovesForPlayer(playerColor, board) {
  const allMoves = [];
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const p = board[row][col];
      if (p && p.color === playerColor) {
        const targets = calculateValidTargetsForPiece(row, col, p, board);
        targets.forEach(([tr, tc]) => {
          allMoves.push({ from: [row, col], to: [tr, tc], piece: p });
        });
      }
    }
  }
  return allMoves;
}

/**
 * Check if the opponent can escape check
 * @param {string} opponentColor - color of the opponent
 * @param {Array} board - current board state after move
 * @param {string} currentColor - the player who delivered the check
 * @returns {boolean} canEscape
 */
function canOpponentEscape(opponentColor, board, currentColor) {
  const moves = getAllValidMovesForPlayer(opponentColor, board);

  for (const move of moves) {
    const simulated = simulateMove(board, move.from, move.to, move.piece);
    const kingPos = findKingPosition(opponentColor, simulated);
    if (!kingPos) {
      // No king found (strange state) but treat as escape scenario
      return true;
    }
    const threats = getSquaresThreatenedByColor(simulated, currentColor);
    const stillThreatened = threats.some(([r, c]) => r === kingPos.row && c === kingPos.col);
    if (!stillThreatened) {
      // Found a move that resolves the check
      return true;
    }
  }

  // No move escapes the threat, so it's checkmate
  return false;
}
