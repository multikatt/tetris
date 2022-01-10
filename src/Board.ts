import Tetromino from "./Tetromino"

export default class Board {
  tetrominos: Tetromino[];

  constructor() {
    this.tetrominos = [];
  }

  add_tetromino(tetro: Tetromino) {
    this.tetrominos.push(tetro);
  }

  get_active_tetromino() : Tetromino {
    return this.tetrominos.filter(t => t.active == true)[0];
  }
}
