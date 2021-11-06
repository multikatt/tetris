class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  time: { start: DOMHighResTimeStamp; prev: DOMHighResTimeStamp };
  active_tetromino: Tetromino;
  tetrominos: Tetromino[];

  constructor() {
    this.canvas = document.getElementById("Game") as HTMLCanvasElement;
    this.ctx = this.canvas.getContext("2d");
    this.time = { start: 0, prev: 0 };
  }

  start() {
    this.drawBorder();
    window.requestAnimationFrame(this.update);
    const tetro = new Tetromino();
    tetro.build_tetromino();
    this.active_tetromino = tetro;
    tetro.draw();
    this.input();
  }

  update = (_timestamp: DOMHighResTimeStamp) => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.drawBorder();
    this.active_tetromino.draw();
    window.requestAnimationFrame(this.update);

  };

  drawBorder(width = 12, height = 22) {
    const border_blocks: Block[] = [];
    for (let ix = 0; ix < width; ix++) {
      for (let iy = 0; iy < height; iy++) {
        if (iy == 0 || iy == height - 1 || ix == 0 || ix == width - 1) {
          border_blocks.push(new Block(ix, iy, "grey"));
        }
      }
    }
    border_blocks.forEach((b) => b.draw());
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
        case "ArrowDown":
          console.log("down");
          break;
        default:
          break;
      }

    })
  }
}

class Block extends Game {
  size = 20;
  margin = 2;
  pos_x: number;
  pos_y: number;
  color: string;

  constructor(pos_x: number, pos_y: number, color: string) {
    super();
    this.pos_x = pos_x;
    this.pos_y = pos_y;
    this.color = color;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.pos_x * (this.size + this.margin),
      this.pos_y * (this.size + this.margin),
      this.size,
      this.size
    );
  }
}

class Tetromino {
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
      this.straight.blocks.push(new Block(this.pos_x + i, this.pos_y, "blue"));
    });
  }

  draw() {
    this.straight.blocks.forEach((block) => {
      block.draw();
    });
  }
}

const game = new Game();
game.start();
