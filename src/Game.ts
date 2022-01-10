import Tetromino from "./Tetromino";
import Block from "./Block";
import Board from "./Board";

export default class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  time: { start: DOMHighResTimeStamp; prev: DOMHighResTimeStamp };
  tetrominos: Tetromino[];
  border_blocks: Block[];
  speed = 500;
  board: Board;

  constructor() {
    this.canvas = document.getElementById("Game") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d");
    this.time = { start: 0, prev: 0 };
    this.border_blocks = [];
    this.create_border();
    this.board = new Board();
  }

  start() {
    window.requestAnimationFrame(this.update);
    const tetro = new Tetromino();
    tetro.active = true;
    tetro.update_tetromino();
    this.board.add_tetromino(tetro);
    this.input();
  }

  update = (timestamp: DOMHighResTimeStamp) => {
    let elapsed = timestamp - this.time.prev;
    if (elapsed > this.speed) {
      this.time.prev = timestamp;
      this.board.get_active_tetromino().move("down");
      this.draw_game();
    }
    window.requestAnimationFrame(this.update);
  };

  create_border(width = 12, height = 22) {
    for (let ix = 0; ix < width; ix++) {
      for (let iy = 0; iy < height; iy++) {
        if (iy == 0 || iy == height - 1 || ix == 0 || ix == width - 1) {
          this.border_blocks.push(new Block({ x: ix, y: iy }, "grey"));
        }
      }
    }
  }

  draw_game() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.border_blocks.forEach((b) => this.draw_block(b));
    this.draw_tetrominos();
  }

  draw_tetrominos() {
    this.board.tetrominos.forEach(t => {
      t.straight.blocks.forEach((b) => this.draw_block(b));
    })
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
      switch (key.code) {
        case "ArrowLeft":
          this.board.get_active_tetromino().move("left");
          this.draw_game();
          break;
        case "ArrowRight":
          this.board.get_active_tetromino().move("right");
          this.draw_game();
          break;
        case "Space":
        case "ArrowUp":
          this.board.get_active_tetromino().rotate("right");
          this.draw_game();
          break;
        case "ArrowDown":
          console.log("down");
          break;
        default:
          break;
      }
    });
  }
}
