import Tetromino from "./Tetromino";
import Block from "./Block";

export default class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  time: { start: DOMHighResTimeStamp; prev: DOMHighResTimeStamp };
  active_tetromino: Tetromino;
  tetrominos: Tetromino[];
  border_blocks: Block[];
  speed = 250;

  constructor() {
    this.canvas = document.getElementById("Game") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d");
    this.time = { start: 0, prev: 0 };
    this.border_blocks = [];
  }

  start() {
    this.createBorder();
    window.requestAnimationFrame(this.update);
    const tetro = new Tetromino();
    tetro.build_tetromino();
    this.active_tetromino = tetro;
    this.input();
  }

  update = (timestamp: DOMHighResTimeStamp) => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.createBorder();
    if (timestamp - this.time.prev > this.speed
        && this.active_tetromino.pos_y < 20) {
            this.active_tetromino.pos_y += 1;
            this.active_tetromino.build_tetromino();
            this.time.prev = timestamp;
        }
    this.drawGame();
    window.requestAnimationFrame(this.update);

  };

  createBorder(width = 12, height = 22) {
    for (let ix = 0; ix < width; ix++) {
      for (let iy = 0; iy < height; iy++) {
        if (iy == 0 || iy == height - 1 || ix == 0 || ix == width - 1) {
          this.border_blocks.push(new Block({x: ix,y: iy}, "grey"));
        }
      }
    }
  }

  drawGame() {
    this.border_blocks.forEach((b) => this.drawBlock(b));
    this.active_tetromino.straight.blocks.forEach(b => this.drawBlock(b));
  }

  drawBlock(block: Block) {
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
          if (this.active_tetromino.pos_x > 1) {
            this.active_tetromino.pos_x -= 1
            this.active_tetromino.build_tetromino();
          }
          break;
        case "ArrowRight":
          if (this.active_tetromino.pos_x < 7) {
            this.active_tetromino.pos_x += 1
            this.active_tetromino.build_tetromino();
          }
          break;
        case "Space":
        case "ArrowUp":
          console.log("up");
          this.active_tetromino.rotate("right");
          this.active_tetromino.build_tetromino();
          break;
        case "ArrowDown":
          console.log("down");
          break;
        default:
          break;
      }
    })
  }
}
