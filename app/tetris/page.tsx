'use client';

import { useTetris } from '@/app/hooks/useTetris';
import { GameBoard } from './components/GameBoard';
import { NextPiece } from './components/NextPiece';
import { ScoreBoard } from './components/ScoreBoard';
import { Controls } from './components/Controls';

export default function TetrisPage() {
  const { gameState, resetGame, togglePause } = useTetris();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Tetris
        </h1>

        <div className="flex flex-col lg:flex-row gap-8 items-start justify-center">
          {/* Game Board */}
          <div className="flex justify-center">
            <GameBoard board={gameState.board} currentPiece={gameState.currentPiece} />
          </div>

          {/* Side Panel */}
          <div className="flex flex-col gap-4 w-full lg:w-64">
            <ScoreBoard
              score={gameState.score}
              isGameOver={gameState.isGameOver}
              isPaused={gameState.isPaused}
            />
            <NextPiece piece={gameState.nextPiece} />
            <Controls
              onReset={resetGame}
              onPause={togglePause}
              isGameOver={gameState.isGameOver}
              isPaused={gameState.isPaused}
            />
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-8 text-center text-slate-400 text-sm">
          <p>Use arrow keys to move and rotate. Press Space for hard drop. Press P to pause.</p>
        </div>
      </div>
    </div>
  );
}
