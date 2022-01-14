import Tetromino from "./Tetromino";
import Block from "./Block";

export default class Board {
  active_tetromino: Tetromino;

  constructor(public occupied_blocks: Block[] = []) {}

  add_to_occupied_blocks(tetro: Tetromino) {
    tetro.blocks.forEach((block) => {
      this.occupied_blocks.push(block);
    });
  }
}
