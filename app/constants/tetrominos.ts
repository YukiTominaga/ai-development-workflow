import type { TetrominoType } from '@/app/types/tetris';

export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;

export const TETROMINO_TYPES: TetrominoType[] = ['I', 'J', 'L', 'O', 'S', 'T', 'Z'];

export const GAME_LOOP_INTERVAL_MS = 1000;
export const HARD_DROP_BONUS_PER_CELL = 2;

export const TETROMINO_SHAPES: Record<TetrominoType, number[][]> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
};

export const TETROMINO_COLORS: Record<TetrominoType, string> = {
  I: '#00f0f0', // Cyan
  J: '#0000f0', // Blue
  L: '#f0a000', // Orange
  O: '#f0f000', // Yellow
  S: '#00f000', // Green
  T: '#a000f0', // Purple
  Z: '#f00000', // Red
};
