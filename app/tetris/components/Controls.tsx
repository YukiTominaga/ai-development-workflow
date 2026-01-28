interface ControlsProps {
  onReset: () => void;
  onPause: () => void;
  isGameOver: boolean;
  isPaused: boolean;
}

export function Controls({ onReset, onPause, isGameOver, isPaused }: ControlsProps) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border-2 border-slate-700">
      <h3 className="text-white text-sm font-medium mb-3">Controls</h3>
      <div className="space-y-2 text-xs text-slate-300">
        <div className="flex justify-between">
          <span>Move:</span>
          <span className="text-white">← →</span>
        </div>
        <div className="flex justify-between">
          <span>Rotate:</span>
          <span className="text-white">↑</span>
        </div>
        <div className="flex justify-between">
          <span>Soft Drop:</span>
          <span className="text-white">↓</span>
        </div>
        <div className="flex justify-between">
          <span>Hard Drop:</span>
          <span className="text-white">Space</span>
        </div>
        <div className="flex justify-between">
          <span>Pause:</span>
          <span className="text-white">P</span>
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {!isGameOver && (
          <button
            onClick={onPause}
            className="w-full px-6 py-3 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors font-medium"
          >
            {isPaused ? 'Resume' : 'Pause'}
          </button>
        )}
        <button
          onClick={onReset}
          className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
        >
          {isGameOver ? 'New Game' : 'Restart'}
        </button>
      </div>
    </div>
  );
}
