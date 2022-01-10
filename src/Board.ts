import Tetromino from "./Tetromino"

export default class Board {
  tetrominos: Tetromino[];

  constructor() {
    this.tetrominos = [];
  }

  add_tetromino(tetro: Tetromino) {
    this.tetrominos.push(tetro);
  }
}
