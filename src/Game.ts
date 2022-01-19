import Block from "./Block";
import Board from "./Board";
import Tetromino from "./Tetromino";

export default class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  prev_time: DOMHighResTimeStamp;
  board: Board;
  speed = 250;
  size = { w: 12, h: 22 };
  game_state: "running" | "stopped" = "running";

  constructor() {
    this.canvas = document.getElementById("Game") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
    this.prev_time = 0;
    this.board = new Board();
    this.create_border(this.size.w, this.size.h);
  }

  start() {
    window.requestAnimationFrame(this.update);
    this.spawn_tetromino();
    this.draw_game();
    this.input();
  }

  spawn_tetromino() {
    this.board.active_tetromino = this.board.next_tetromino === undefined ? new Tetromino() : this.board.next_tetromino;
    this.board.next_tetromino = new Tetromino();
    if (this.board.next_tetromino.type == "O") {
      this.board.next_tetromino.pos_x = 15;
    } else if (this.board.next_tetromino.type == "I") {
      this.board.next_tetromino.pos_x = 14;
    } else {
      this.board.next_tetromino.pos_x = 14.5;
    }

    this.board.next_tetromino.update_tetromino();
    this.board.active_tetromino.pos_x = 4;
    this.board.active_tetromino.update_tetromino();
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
          if (!this.contains_full_rows()) {
            this.board.add_to_occupied_blocks(this.board.active_tetromino);
          }
          this.spawn_tetromino();
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
          this.board.occupied_blocks.push(
            new Block({ x: ix, y: iy }, "grey", true)
          );
        }
      }
    }
  }

  contains_full_rows(): boolean {
    let full_rows: number[] = [];

    // filter out one block per row:
    let single_block_per_row = this.board.active_tetromino.blocks.filter(
      (b, i, o) => o.map((b) => b.pos.y).indexOf(b.pos.y) == i
    );

    // check the single block for each row:
    single_block_per_row.forEach((block) => {
      // count number of blocks occupied by current tetro on current row
      let current_t = this.board.active_tetromino.blocks.filter(
        (t) => t.pos.y === block.pos.y
      );

      // count number of other blocks
      let current_row = this.board.occupied_blocks.filter(
        (bb) => bb.pos.y == block.pos.y
      );

      let full_row = current_t.length + current_row.length == this.size.w;

      if (full_row) {
        full_rows.push(block.pos.y);
      }
    });

    if (full_rows.length > 0) {
      // add current tetro so that blocks not on a full row doesn't disappear
      this.board.add_to_occupied_blocks(this.board.active_tetromino);

      // filter out full rows
      full_rows.forEach((r) => {
        this.board.occupied_blocks = this.board.occupied_blocks.filter(
          (b) => b.pos.y != r || b.border_block == true
        );
        this.board.occupied_blocks
          .filter((b) => b.pos.y < r && b.border_block == false)
          .forEach((b) => {
            b.pos.y += 1;
          });
      });
      return true;
    }

    return false;
  }

  check_collision(dir: "down" | "left" | "right"): boolean {
    let current_t = this.board.active_tetromino;
    let can_move = true;
    let can_move_down = (blockpos: { x: number; y: number }): boolean => {
      this.board.occupied_blocks.forEach((b) => {
        if (b.pos.x == blockpos.x && b.pos.y == blockpos.y + 1) {
          can_move = false;
        }
      });
      return can_move;
    };

    let can_move_sideways = (
      blockpos: { x: number; y: number },
      dir: "left" | "right"
    ): boolean => {
      this.board.occupied_blocks.forEach((b) => {
        if (dir == "left") {
          if (b.pos.y == blockpos.y && b.pos.x == blockpos.x - 1) {
            can_move = false;
          }
        } else if (dir == "right") {
          if (b.pos.y == blockpos.y && b.pos.x == blockpos.x + 1) {
            can_move = false;
          }
        }
      });

      return can_move;
    };

    current_t.shape.forEach((row, irow) => {
      row.forEach((block, iblock) => {
        if (block === 1) {
          let blockpos = {
            x: iblock + current_t.pos_x,
            y: irow + current_t.pos_y,
          };

          if (dir == "left" && !can_move_sideways(blockpos, "left")) {
            can_move = false;
          } else if (dir == "right" && !can_move_sideways(blockpos, "right")) {
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
    this.draw_tetrominos();
  }

  draw_tetrominos() {
    this.board.active_tetromino.blocks.forEach((b) => this.draw_block(b));
    this.board.occupied_blocks.forEach((b) => this.draw_block(b));
    this.board.next_tetromino.blocks.forEach((b) => this.draw_block(b));
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
          case "KeyX":
            this.board.active_tetromino.rotate(
              "right",
              this.board.occupied_blocks
            );
            this.draw_game();
            break;
          case "KeyZ":
            this.board.active_tetromino.rotate(
              "left",
              this.board.occupied_blocks
            );
            this.draw_game();
            break;
          case "ArrowDown":
            while (this.check_collision("down"))
              this.board.active_tetromino.move("down");
            this.draw_game();
            break;
          default:
            break;
        }
      }
    });
  }
}
