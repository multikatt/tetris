import Tetromino from "./Tetromino";
import Block from "./Block";

interface block_i {
  [key: string]: any
}

export default class Board implements block_i {
  [key: string]: any;
  active_tetromino!: Tetromino;
  next_tetromino!: Tetromino;
  occupied_blocks: { blocks: Block[] };

  constructor() {
    this.occupied_blocks = { blocks: [] };
    this.occupied_blocks.blocks = [];
  }

  add_to_occupied_blocks(tetro: Tetromino) {
    tetro.blocks.forEach((block) => {
      this.occupied_blocks.blocks.push(block);
    });
  }
}
