import Block from "./Block";
import Shapes from "./Shapes";

export default class Tetromino {
  shape: number[][];
  color: string;
  blocks: Block[];
  rotation_state = 0;
  pos_x = 4;
  pos_y = 1;
  rotation_tests = {
    0: {
      1: [
        [0, 0],
        [-1, 0],
        [-1, -1],
        [0, 2],
        [-1, 2],
      ],
      3: [
        [0, 0],
        [1, 0],
        [1, -1],
        [0, 2],
        [1, 2],
      ],
    },
    1: {
      0: [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, -2],
        [1, -2],
      ],
      2: [
        [0, 0],
        [1, 0],
        [1, 1],
        [0, -2],
        [1, -2],
      ],
    },
    2: {
      1: [
        [0, 0],
        [-1, 0],
        [-1, -1],
        [0, 2],
        [-1, 2],
      ],
      3: [
        [0, 0],
        [1, 0],
        [1, -1],
        [0, 2],
        [1, 2],
      ],
    },
    3: {
      2: [
        [0, 0],
        [-1, 0],
        [-1, 1],
        [0, -2],
        [-1, -2],
      ],
      0: [
        [0, 0],
        [-1, 0],
        [-1, 1],
        [0, -2],
        [-1, -2],
      ],
    },
  };

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

  rotate(dir: "left" | "right" = "right", occupied_blocks?: Block[]) {
    let check_collision = (wanted_state: number, tmp_shape: number[][]) => {
      let found_solution = null;
      this.rotation_tests[this.rotation_state][wanted_state].some(
        (rot: number[]) => {
          let found_hit = false;
          tmp_shape.forEach((row, irow) => {
            row.forEach((block, iblock) => {
              if (block === 1) {
                let blockpos = {
                  x: iblock + this.pos_x,
                  y: irow + this.pos_y,
                };

                if (
                  occupied_blocks.find(
                    (b) =>
                      b.pos.x == blockpos.x + rot[0] &&
                      b.pos.y == blockpos.y + rot[1]
                  ) != null
                ) {
                  found_hit = true;
                }
              }
            });
          });
          if (found_hit == false) {
            found_solution = rot;
            return true;
          }
        }
      );

      if (found_solution) return found_solution;
      else return false;
    };

    if (dir == "left") {
      this.shape = this.shape.map((_x, i, s) => s.map((y) => y[i])).reverse();
      this.rotation_state = (this.rotation_state + 3) % 4;
    }
    if (dir == "right") {
      let wanted_state = (this.rotation_state + 1) % 4;
      let tmp_shape = this.shape
        .reverse()
        .map((_x, i, s) => s.map((_y) => _y[i]));
      let found_solution = check_collision(wanted_state, tmp_shape);
      if (found_solution != false) {
        this.pos_x += found_solution[0];
        this.pos_y += found_solution[1];
        this.shape = tmp_shape;
        this.rotation_state = wanted_state;
      }
    }
    this.update_tetromino();
  }
}
