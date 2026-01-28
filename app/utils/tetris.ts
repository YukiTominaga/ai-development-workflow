import type { Board, Tetromino, TetrominoType } from '@/app/types/tetris';
import { BOARD_HEIGHT, BOARD_WIDTH, TETROMINO_COLORS, TETROMINO_SHAPES, TETROMINO_TYPES } from '@/app/constants/tetris';

export function createEmptyBoard(): Board {
  return Array.from({ length: BOARD_HEIGHT }, () =>
    Array.from({ length: BOARD_WIDTH }, () => null)
  );
}

// 7-bag algorithm: ensures fair distribution of tetrominos
let tetrominoBag: TetrominoType[] = [];

function refillBag(): void {
  tetrominoBag = [...TETROMINO_TYPES].sort(() => Math.random() - 0.5);
}

export function createRandomTetromino(): Tetromino {
  if (tetrominoBag.length === 0) {
    refillBag();
  }
  const type = tetrominoBag.pop()!;
  return createTetromino(type);
}

export function createTetromino(type: TetrominoType): Tetromino {
  return {
    type,
    shape: TETROMINO_SHAPES[type],
    color: TETROMINO_COLORS[type],
    position: {
      x: Math.floor(BOARD_WIDTH / 2) - Math.floor(TETROMINO_SHAPES[type][0].length / 2),
      y: 0,
    },
  };
}

export function rotateTetromino(tetromino: Tetromino): Tetromino {
  // Don't rotate O piece
  if (tetromino.type === 'O') {
    return tetromino;
  }

  const rotated = tetromino.shape[0].map((_, index) =>
    tetromino.shape.map(row => row[index]).reverse()
  );

  return {
    ...tetromino,
    shape: rotated,
  };
}

export function checkCollision(
  board: Board,
  tetromino: Tetromino,
  offsetX: number = 0,
  offsetY: number = 0
): boolean {
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x]) {
        const newX = tetromino.position.x + x + offsetX;
        const newY = tetromino.position.y + y + offsetY;

        // Check boundaries
        if (newX < 0 || newX >= BOARD_WIDTH || newY >= BOARD_HEIGHT) {
          return true;
        }

        // Check if position is occupied (skip if newY is negative for spawning)
        if (newY >= 0 && board[newY][newX]) {
          return true;
        }
      }
    }
  }
  return false;
}

export function mergePieceToBoard(board: Board, tetromino: Tetromino): Board {
  const newBoard = board.map(row => [...row]);

  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x]) {
        const boardY = tetromino.position.y + y;
        const boardX = tetromino.position.x + x;
        if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
          newBoard[boardY][boardX] = tetromino.color;
        }
      }
    }
  }

  return newBoard;
}

export function clearLines(board: Board): { newBoard: Board; linesCleared: number } {
  let linesCleared = 0;
  const newBoard = board.filter(row => {
    const isFull = row.every(cell => cell !== null);
    if (isFull) {
      linesCleared++;
      return false;
    }
    return true;
  });

  // Add empty rows at the top
  while (newBoard.length < BOARD_HEIGHT) {
    newBoard.unshift(Array.from({ length: BOARD_WIDTH }, () => null));
  }

  return { newBoard, linesCleared };
}

export function calculateScore(linesCleared: number): number {
  // Standard Tetris scoring
  const scores = [0, 100, 300, 500, 800];
  return scores[linesCleared] || 0;
}

export function isGameOver(board: Board): boolean {
  // Check if any cell in the top row is occupied
  return board[0].some(cell => cell !== null);
}
