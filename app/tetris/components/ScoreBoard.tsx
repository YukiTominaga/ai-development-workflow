interface ScoreBoardProps {
  score: number;
  isGameOver: boolean;
  isPaused: boolean;
}

export function ScoreBoard({ score, isGameOver, isPaused }: ScoreBoardProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border-2 border-slate-700">
      <h3 className="text-white text-sm font-medium mb-3">Score</h3>
      <div className="text-3xl font-bold text-cyan-400">{score}</div>

      {isGameOver && (
        <div className="mt-4 px-3 py-1 bg-red-600 text-white text-xs font-medium rounded-full text-center">
          Game Over
        </div>
      )}

      {isPaused && !isGameOver && (
        <div className="mt-4 px-3 py-1 bg-yellow-600 text-white text-xs font-medium rounded-full text-center">
          Paused
        </div>
      )}
    </div>
  );
}
