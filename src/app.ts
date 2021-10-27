class Game {
  ctx: CanvasRenderingContext2D;
  constructor() {
    const canvas = document.getElementById("Game") as HTMLCanvasElement;
    this.ctx = canvas.getContext("2d");
  }

  start() {
    this.drawBorder();
  }

  drawBorder(width = 12, height = 22) {
    const border_blocks: Block[] = [];
    for (let ix = 0; ix < width; ix++) {
      for (let iy = 0; iy < height; iy++) {
        if (iy == 0 || iy == height - 1 || ix == 0 || ix == width - 1) {
          border_blocks.push(new Block(ix + 1, iy + 1, "grey"));
        }
      }
    }
    border_blocks.forEach((b) => b.draw());
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

class Tetromino extends Block {
  // prettier-ignore
  straight = [0, 0, 0,
              0, 0, 0,
              1, 1, 1];
}

const game = new Game();
game.start();
