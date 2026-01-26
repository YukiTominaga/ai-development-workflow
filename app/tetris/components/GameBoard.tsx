import type { Board, Tetromino } from '@/app/types/tetris';

interface GameBoardProps {
  board: Board;
  currentPiece: Tetromino | null;
}

export function GameBoard({ board, currentPiece }: GameBoardProps) {
  // Create a display board that includes the current piece
  const displayBoard = board.map(row => [...row]);

  if (currentPiece) {
    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardY = currentPiece.position.y + y;
          const boardX = currentPiece.position.x + x;
          if (boardY >= 0 && boardY < board.length && boardX >= 0 && boardX < board[0].length) {
            displayBoard[boardY][boardX] = currentPiece.color;
          }
        }
      }
    }
  }

  return (
    <div className="inline-block bg-slate-900 p-2 rounded-lg border-2 border-slate-700">
      <div className="grid gap-[1px] bg-slate-800" style={{ gridTemplateColumns: `repeat(${board[0].length}, 1fr)` }}>
        {displayBoard.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              className="w-6 h-6 border border-slate-700"
              style={{
                backgroundColor: cell || '#1e293b',
              }}
            />
          ))
        )}
      </div>
    </div>
  );
}
