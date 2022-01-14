import Block from "./Block";
import Board from "./Board";
import Tetromino from "./Tetromino";

export default class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  prev_time: DOMHighResTimeStamp;
  tetrominos: Tetromino[];
  border_blocks: Block[];
  board: Board;
  speed = 250;
  size = { w: 12, h: 22 };
  game_state: "running" | "stopped" = "running";

  constructor() {
    this.canvas = document.getElementById("Game") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d");
    this.prev_time = 0;
    this.border_blocks = [];
    this.create_border(this.size.w, this.size.h);
    this.board = new Board();
  }

  start() {
    window.requestAnimationFrame(this.update);
    const tetro = new Tetromino();
    tetro.update_tetromino();
    this.board.active_tetromino = tetro;
    this.draw_game();
    this.input();
  }

  update = (timestamp: DOMHighResTimeStamp) => {
    let elapsed = timestamp - this.prev_time;
    if (elapsed > this.speed) {
      this.prev_time = timestamp;
      if (this.check_collision("down")) {
        this.board.active_tetromino.move("down");
      } else {
        if (this.board.active_tetromino.pos_y === 1) {
          this.game_state = "stopped";
        } else {
          this.board.add_to_occupied_blocks(this.board.active_tetromino);
          const tetro = new Tetromino();
          tetro.update_tetromino();
          this.board.active_tetromino = tetro;
        }
      }
      this.draw_game();
    }
    if (this.game_state === "running")
      window.requestAnimationFrame(this.update);
  };

  create_border(width: number, height: number) {
    for (let ix = 0; ix < width; ix++) {
      for (let iy = 0; iy < height; iy++) {
        if (iy == 0 || iy == height - 1 || ix == 0 || ix == width - 1) {
          this.border_blocks.push(new Block({ x: ix, y: iy }, "grey"));
        }
      }
    }
  }

  check_collision(dir: "down" | "left" | "right"): boolean {
    let current_t = this.board.active_tetromino;
    let can_move = true;
    let can_move_down = (blockpos: { x: number; y: number }): boolean => {
      if (blockpos.y >= this.size.h - 2) {
        can_move = false;
      } else {
        this.board.occupied_blocks.forEach((b) => {
          if (b.pos.x == blockpos.x && b.pos.y == blockpos.y + 1) {
            can_move = false;
          }
        });
      }
      return can_move;
    };

    current_t.shape.forEach((row, irow) => {
      row.forEach((block, iblock) => {
        if (block === 1) {
          let blockpos = {
            x: iblock + current_t.pos_x,
            y: irow + current_t.pos_y,
          };

          if (dir == "left" && blockpos.x <= 1) {
            can_move = false;
          } else if (dir == "right" && blockpos.x >= this.size.w - 2) {
            can_move = false;
          } else if (dir == "down" && !can_move_down(blockpos)) {
            can_move = false;
          }
        }
      });
    });
    return can_move;
  }

  draw_game() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.border_blocks.forEach((b) => this.draw_block(b));
    this.draw_tetrominos();
  }

  draw_tetrominos() {
    this.board.active_tetromino.blocks.forEach((b) => this.draw_block(b));
    this.board.occupied_blocks.forEach((b) => this.draw_block(b));
  }

  draw_block(block: Block) {
    this.ctx.fillStyle = block.color;
    this.ctx.fillRect(
      block.pos.x * (block.size + block.margin),
      block.pos.y * (block.size + block.margin),
      block.size,
      block.size
    );
  }

  input() {
    window.addEventListener("keyup", (key) => {
      if (this.game_state == "running") {
        switch (key.code) {
          case "ArrowLeft":
            if (this.check_collision("left"))
              this.board.active_tetromino.move("left");
            this.draw_game();
            break;
          case "ArrowRight":
            if (this.check_collision("right"))
              this.board.active_tetromino.move("right");
            this.draw_game();
            break;
          case "Space":
          case "ArrowUp":
            this.board.active_tetromino.rotate("right");
            this.draw_game();
            break;
          case "ArrowDown":
            console.log("down");
            break;
          default:
            break;
        }
      }
    });
  }
}
