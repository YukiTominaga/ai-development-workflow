import { useState, useCallback, useEffect, useRef } from 'react';

import { BOARD_WIDTH, BOARD_HEIGHT, TETROMINO_SHAPES, TETROMINO_COLORS, TETROMINO_TYPES, GAME_LOOP_INTERVAL_MS, HARD_DROP_BONUS_PER_CELL } from '@/app/constants/tetrominos';

import type { Board, Tetromino, TetrominoType, GameState } from '@/app/types/tetris';

function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));
}

function createRandomTetromino(): Tetromino {
  const type = TETROMINO_TYPES[Math.floor(Math.random() * TETROMINO_TYPES.length)];
  return {
    type,
    shape: TETROMINO_SHAPES[type],
    color: TETROMINO_COLORS[type],
    position: { x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETROMINO_SHAPES[type][0].length / 2), y: 0 },
  };
}

function rotatePiece(piece: Tetromino): Tetromino {
  const newShape = piece.shape[0].map((_, index) =>
    piece.shape.map(row => row[index]).reverse()
  );
  return { ...piece, shape: newShape };
}

function checkCollision(board: Board, piece: Tetromino, offsetX = 0, offsetY = 0): boolean {
  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const newX = piece.position.x + x + offsetX;
        const newY = piece.position.y + y + offsetY;

        if (
          newX < 0 ||
          newX >= BOARD_WIDTH ||
          newY >= BOARD_HEIGHT ||
          (newY >= 0 && board[newY][newX])
        ) {
          return true;
        }
      }
    }
  }
  return false;
}

function mergePieceToBoard(board: Board, piece: Tetromino): Board {
  const newBoard = board.map(row => [...row]);

  for (let y = 0; y < piece.shape.length; y++) {
    for (let x = 0; x < piece.shape[y].length; x++) {
      if (piece.shape[y][x]) {
        const boardY = piece.position.y + y;
        const boardX = piece.position.x + x;
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = piece.color;
        }
      }
    }
  }

  return newBoard;
}

function clearLines(board: Board): { newBoard: Board; linesCleared: number } {
  const newBoard = board.filter(row => row.some(cell => cell === null));
  const linesCleared = BOARD_HEIGHT - newBoard.length;

  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array(BOARD_WIDTH).fill(null));
  }

  return { newBoard, linesCleared };
}

function calculateLineScore(linesCleared: number): number {
  const lineScores = [0, 100, 300, 500, 800];
  return lineScores[linesCleared] || linesCleared * 100;
}

function createNextGameState(
  prev: GameState,
  clearedBoard: Board,
  newScore: number
): GameState {
  if (prev.nextPiece && checkCollision(clearedBoard, prev.nextPiece)) {
    return {
      ...prev,
      board: clearedBoard,
      currentPiece: null,
      isGameOver: true,
      score: newScore,
    };
  }

  return {
    ...prev,
    board: clearedBoard,
    currentPiece: prev.nextPiece,
    nextPiece: createRandomTetromino(),
    score: newScore,
  };
}

export function useTetris() {
  const [gameState, setGameState] = useState<GameState>(() => ({
    board: createEmptyBoard(),
    currentPiece: createRandomTetromino(),
    nextPiece: createRandomTetromino(),
    score: 0,
    isGameOver: false,
    isPaused: false,
  }));

  const gameLoopRef = useRef<NodeJS.Timeout | null>(null);

  const movePiece = useCallback((deltaX: number, deltaY: number) => {
    setGameState(prev => {
      if (prev.isGameOver || prev.isPaused || !prev.currentPiece) return prev;

      if (!checkCollision(prev.board, prev.currentPiece, deltaX, deltaY)) {
        return {
          ...prev,
          currentPiece: {
            ...prev.currentPiece,
            position: {
              x: prev.currentPiece.position.x + deltaX,
              y: prev.currentPiece.position.y + deltaY,
            },
          },
        };
      }

      // If moving down and collision, lock the piece
      if (deltaY > 0) {
        const newBoard = mergePieceToBoard(prev.board, prev.currentPiece);
        const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
        const newScore = prev.score + calculateLineScore(linesCleared);

        return createNextGameState(prev, clearedBoard, newScore);
      }

      return prev;
    });
  }, []);

  const rotate = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver || prev.isPaused || !prev.currentPiece) return prev;

      const rotated = rotatePiece(prev.currentPiece);

      if (!checkCollision(prev.board, rotated)) {
        return {
          ...prev,
          currentPiece: rotated,
        };
      }

      return prev;
    });
  }, []);

  const hardDrop = useCallback(() => {
    setGameState(prev => {
      if (prev.isGameOver || prev.isPaused || !prev.currentPiece) return prev;

      let dropDistance = 0;
      while (!checkCollision(prev.board, prev.currentPiece, 0, dropDistance + 1)) {
        dropDistance++;
      }

      const droppedPiece = {
        ...prev.currentPiece,
        position: {
          ...prev.currentPiece.position,
          y: prev.currentPiece.position.y + dropDistance,
        },
      };

      const newBoard = mergePieceToBoard(prev.board, droppedPiece);
      const { newBoard: clearedBoard, linesCleared } = clearLines(newBoard);
      const newScore = prev.score + calculateLineScore(linesCleared) + dropDistance * HARD_DROP_BONUS_PER_CELL;

      return createNextGameState(prev, clearedBoard, newScore);
    });
  }, []);

  const togglePause = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPaused: !prev.isPaused,
    }));
  }, []);

  const resetGame = useCallback(() => {
    setGameState({
      board: createEmptyBoard(),
      currentPiece: createRandomTetromino(),
      nextPiece: createRandomTetromino(),
      score: 0,
      isGameOver: false,
      isPaused: false,
    });
  }, []);

  // Game loop
  useEffect(() => {
    if (gameState.isGameOver || gameState.isPaused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    gameLoopRef.current = setInterval(() => {
      movePiece(0, 1);
    }, GAME_LOOP_INTERVAL_MS);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
      }
    };
  }, [gameState.isGameOver, gameState.isPaused]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState.isGameOver) return;

      // Pause/unpause is always allowed
      if (e.key === 'p' || e.key === 'P') {
        e.preventDefault();
        togglePause();
        return;
      }

      // Other controls are blocked when paused
      if (gameState.isPaused) return;

      switch (e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          movePiece(-1, 0);
          break;
        case 'ArrowRight':
          e.preventDefault();
          movePiece(1, 0);
          break;
        case 'ArrowDown':
          e.preventDefault();
          movePiece(0, 1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          rotate();
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.isGameOver, gameState.isPaused]);

  return {
    gameState,
    resetGame,
    togglePause,
  };
}
