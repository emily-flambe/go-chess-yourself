// fen.js
import { getSquaresThreatenedByColor, findKingPosition, calculateValidTargetsForPiece } from './Movesets'; 
// Import only if needed, or remove if this file does not need these dependencies.

function pieceToFENChar(piece) {
  if (!piece) return null;
  const charMap = {
    'Pawn': 'P',
    'Knight': 'N',
    'Bishop': 'B',
    'Rook': 'R',
    'Queen': 'Q',
    'King': 'K'
  };
  let c = charMap[piece.type];
  if (piece.color === 'Black') {
    c = c.toLowerCase();
  }
  return c;
}

function boardToFEN(board, currentTurn, castlingRights, enPassantTarget, halfmoveClock, fullmoveNumber) {
  // 1. Piece placement
  let fenRows = [];
  for (let r = 0; r < 8; r++) {
    let rankStr = '';
    let emptyCount = 0;
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (!piece) {
        emptyCount++;
      } else {
        if (emptyCount > 0) {
          rankStr += emptyCount;
          emptyCount = 0;
        }
        rankStr += pieceToFENChar(piece);
      }
    }
    if (emptyCount > 0) {
      rankStr += emptyCount;
    }
    fenRows.push(rankStr);
  }
  
  // Assuming board[0] is the 8th rank and board[7] is the 1st rank (top to bottom),
  // if your indexing is the opposite, you'd need fenRows.reverse().
  
  const piecePlacement = fenRows.join('/');

  // 2. Active color
  const activeColor = currentTurn === 'White' ? 'w' : 'b';

  // 3. Castling availability
  // Example castlingRights object: {whiteKingside: true, whiteQueenside: false, blackKingside: true, blackQueenside: false}
  let castlingStr = '';
  if (castlingRights.whiteKingside) castlingStr += 'K';
  if (castlingRights.whiteQueenside) castlingStr += 'Q';
  if (castlingRights.blackKingside) castlingStr += 'k';
  if (castlingRights.blackQueenside) castlingStr += 'q';
  if (castlingStr === '') castlingStr = '-';

  // 4. En passant target
  const enPassant = enPassantTarget || '-';

  // 5. Halfmove clock
  const halfmove = halfmoveClock != null ? halfmoveClock : 0;

  // 6. Fullmove number
  const fullmove = fullmoveNumber != null ? fullmoveNumber : 1;

  return `${piecePlacement} ${activeColor} ${castlingStr} ${enPassant} ${halfmove} ${fullmove}`;
}

export { boardToFEN };
