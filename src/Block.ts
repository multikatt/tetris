export default class Block {
  border_block: boolean = false;
  size = 20;
  margin = 2;

  constructor(
    public pos: { x: number; y: number },
    public color: string,
    border_block?: boolean
  ) {
    if (border_block) this.border_block = border_block;
  }
}
