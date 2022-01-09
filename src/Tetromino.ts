import Block from "./Block"

export default class Tetromino {
  straight: {
    shape: number[];
    color: string;
    blocks: Block[];
  } = { shape: [1, 1, 1, 1], color: "blue", blocks: [] };
  pos_x = 4;
  pos_y = 1;

  build_tetromino() {
    this.straight.blocks = [];
    this.straight.shape.forEach((_, i) => {
      this.straight.blocks.push(new Block({x: this.pos_x + i, y: this.pos_y}, this.straight.color));
    });
  }
}

