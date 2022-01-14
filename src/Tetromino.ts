import Block from "./Block";
import Shapes from "./Shapes";

export default class Tetromino {
  shape: number[][];
  color: string;
  blocks: Block[];
  pos_x = 4;
  pos_y = 1;

  get_random_tetro() {
    let shapes = ["I", "J", "L", "O", "S", "T", "Z"];
    return shapes[Math.floor(Math.random() * shapes.length)];
  }

  constructor(type?: string) {
    if (!type) {
      type = this.get_random_tetro();
    }
    this.shape = Shapes[type].shape;
    this.color = Shapes[type].color;
  }

  update_tetromino() {
    this.blocks = [];
    this.shape.forEach((row, irow) => {
      row.forEach((col, icol) => {
        if (col === 1)
          this.blocks.push(
            new Block(
              { x: this.pos_x + icol, y: this.pos_y + irow },
              this.color
            )
          );
      });
    });
  }

  move(dir: "left" | "right" | "down") {
    if (dir == "left") {
      this.pos_x -= 1;
    }
    if (dir == "right") {
      this.pos_x += 1;
    }
    if (dir == "down") {
      this.pos_y += 1;
    }
    this.update_tetromino();
  }

  rotate(dir: "left" | "right" = "right") {
    if (dir == "left") {
      this.shape = this.shape.map((_x, i, s) => s.map((y) => y[i])).reverse();
    }
    if (dir == "right") {
      this.shape = this.shape.reverse().map((_x, i, s) => s.map((_y) => _y[i]));
    }
    this.update_tetromino();
  }
}
