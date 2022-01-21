import Block from "./Block";
import Board from "./Board";
import Tetromino from "./Tetromino";

export default class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  board: Board;
  speed!: number;
  prev_time: DOMHighResTimeStamp = 0;
  score = 0;
  level = 0;
  total_rows_cleared = 0;
  size = { w: 12, h: 22 };
  game_state: "running" | "stopped" = "running";

  constructor() {
    this.set_speed();
    this.canvas = document.getElementById("Game") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d")!;
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

      // Fixed-goal leveling:
      this.level = Math.floor(this.total_rows_cleared / 10);
      this.set_speed();

      if (this.game_state === "running") {
        this.draw_game();
      }
    }
    if (this.game_state === "running")
      window.requestAnimationFrame(this.update);
  };

  set_speed() {
    // From formula on https://harddrop.com/wiki/Tetris_Worlds
    // (0.8-((Level-1)*0.007))^(Level-1)
    this.speed = Math.pow((0.8 - ((this.level) * 0.007)), this.level) * 1000;
  }

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

      // Using original Nintendo scoring system
      let score_per_line = [40, 100, 300, 1200];
      this.score += score_per_line[full_rows.length - 1] * (this.level + 1);

      this.total_rows_cleared += full_rows.length;

      return true;
    }

    return false;
  }

  check_collision(dir: "left" | "right" | "down"): boolean {
    let current_t = this.board.active_tetromino;
    let can_move = true;

    const find_collision = (
      blockpos: { x: number; y: number },
      dir: "left" | "right" | "down"
    ): boolean => {
      let found_hit = false;
      this.board.occupied_blocks.some((b) => {
        switch (dir) {
          case "left":
            if (b.pos.y == blockpos.y && b.pos.x == blockpos.x - 1) {
              found_hit = true;
            }
            break;
          case "right":
            if (b.pos.y == blockpos.y && b.pos.x == blockpos.x + 1) {
              found_hit = true;
            }
            break;
          case "down":
            if (b.pos.x == blockpos.x && b.pos.y == blockpos.y + 1) {
              found_hit = true;
            }
            break;
        }
      });
      return found_hit;
    };

    current_t.shape.forEach((row, irow) => {
      row.forEach((block, iblock) => {
        if (block === 1) {
          let blockpos = {
            x: iblock + current_t.pos_x,
            y: irow + current_t.pos_y,
          };

          if (dir == "left" && find_collision(blockpos, "left")) {
            can_move = false;
          } else if (dir == "right" && find_collision(blockpos, "right")) {
            can_move = false;
          } else if (dir == "down" && find_collision(blockpos, "down")) {
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
    let score_el = document.getElementById("Score")!;
    score_el.innerHTML = this.score.toString();
    let level_el = document.getElementById("Level")!;
    level_el.innerHTML = this.level.toString();
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
    let pressed_key: { [key: string]: boolean } = {};

    let keydown = (key: KeyboardEvent) => {
      pressed_key[key.code] = true;
    }
    let keyup = (key: KeyboardEvent) => {
      pressed_key[key.code] = false;
    }

    let handleKeys = () => {

      if (Object.keys(pressed_key).length > 0 && this.game_state === "running") {
        if (pressed_key["ArrowLeft"]) {
          if (this.check_collision("left"))
            this.board.active_tetromino.move("left");
        }
        if (pressed_key["ArrowRight"]) {
          if (this.check_collision("right"))
            this.board.active_tetromino.move("right");
        }
        if (pressed_key["ArrowDown"]) {
          if (this.check_collision("down"))
            this.board.active_tetromino.move("down");
        }
      }
      this.draw_game();
    }

    window.addEventListener("keydown", (key) => {
      if (this.game_state == "running") {
        if (key.code === "ArrowUp" || key.code === "KeyX") {
          this.board.active_tetromino.rotate(
            "right",
            this.board.occupied_blocks
          );
        };
        if (key.code === "KeyZ") {
          this.board.active_tetromino.rotate(
            "left",
            this.board.occupied_blocks
          );
        }
        if (key.code === "Space" && key.repeat === false) {
          while (this.check_collision("down"))
            this.board.active_tetromino.move("down");
        }
      }
      this.draw_game();
    })

    window.addEventListener("keydown", keydown);
    window.addEventListener("keyup", keyup);

    window.setInterval(handleKeys, 75);
  }
}
