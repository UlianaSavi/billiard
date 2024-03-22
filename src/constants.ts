export enum ROUTES {
  empty = '/',
  game = '/game'
}

export const CIRCLES_COUNT = 15; // standart count for billiard
export const CANVAS_STANDART_WIDTH = 730;
export const CANVAS_STANDART_HEIGHT = 365;
export const CANVAS_STANDART_CIRCLE_SIZE = 10;
export const CANVAS_STANDART_X_VELOSITY = 0.4;
export const CANVAS_STANDART_Y_VELOSITY = 0.6;

export type Ball = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  draw: () => void;
};

export type Position = {
  x: number;
  y: number;
};
