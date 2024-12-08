// Notation.js

const piecesToNotation = {
    'King': 'K',
    'Queen': 'Q',
    'Rook': 'R',
    'Bishop': 'B',
    'Knight': 'N'
  };
  
  /**
   * Converts a move detail object into a simplified chess notation string, including captures.
   * @param {Object} moveDetails - Information about the move
   * @param {Array} moveDetails.from - [fromRow, fromCol]
   * @param {Array} moveDetails.to - [toRow, toCol]
   * @param {Object} moveDetails.piece - { type: string, color: string }
   * @param {Object|null} moveDetails.capturedPiece - The piece captured, or null if no capture
   * @returns {string} notation - The resulting notation (e.g. "Qd5", "e4", "Nxf3", "exd4")
   */
  export function getMoveNotation(moveDetails) {
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
        notation += fromFile.toLowerCase() + 'x' + file + rank; 
      } else {
        // Normal pawn move: just file+rank
        notation += file + rank;
      }
    } else {
      // Non-pawns start with piece letter
      const pieceLetter = piecesToNotation[piece.type] || '';
      if (isCapture) {
        notation += pieceLetter + 'x' + file + rank;
      } else {
        notation += pieceLetter + file + rank;
      }
    }
  
    return notation;
  }
  