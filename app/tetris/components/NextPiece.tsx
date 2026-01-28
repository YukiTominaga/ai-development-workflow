import type { Tetromino } from '@/app/types/tetris';

interface NextPieceProps {
  piece: Tetromino | null;
}

export function NextPiece({ piece }: NextPieceProps) {
  if (!piece) return null;

  return (
    <div className="bg-slate-800 rounded-lg p-4 border-2 border-slate-700">
      <h3 className="text-white text-sm font-medium mb-3">Next</h3>
      <div className="flex items-center justify-center min-h-[96px]">
        <div className="grid gap-[1px]" style={{ gridTemplateColumns: `repeat(${piece.shape[0].length}, 1fr)` }}>
          {piece.shape.map((row, y) =>
            row.map((cell, x) => (
              <div
                key={`${y}-${x}`}
                className="w-5 h-5 border border-slate-700"
                style={{
                  backgroundColor: cell ? piece.color : 'transparent',
                }}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
