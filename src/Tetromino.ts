import Block from "./Block";

export default class Tetromino {
  straight: {
    shape: number[][];
    color: string;
    blocks: Block[];
  } = {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: "blue",
    blocks: [],
  };
  pos_x = 4;
  pos_y = 1;

  update_tetromino() {
    this.straight.blocks = [];
    this.straight.shape.forEach((row, irow) => {
      row.forEach((col, icol) => {
        if (col === 1)
          this.straight.blocks.push(
            new Block(
              { x: this.pos_x + icol, y: this.pos_y + irow },
              this.straight.color
            )
          );
      });
    });
  }

  move(dir: "left" | "right") {
    if (dir == "left") {
      this.pos_x -= 1;
    }
    if (dir == "right") {
      this.pos_x += 1;
    }
  }

  rotate(dir: "left" | "right" = "right") {
    if (dir == "left") {
      this.straight.shape = this.straight.shape
        .map((_x, i, s) => s.map((y) => y[i]))
        .reverse();
    }
    if (dir == "right") {
      this.straight.shape = this.straight.shape
        .reverse()
        .map((_x, i, s) => s.map((_y) => _y[i]));
    }
  }
}
