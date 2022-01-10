import {expect} from 'chai'
import Tetromino from "../src/Tetromino";
//import Block from "../src/Block";

describe('TetrisTests', function() {
    let b =  new Tetromino();
    it('rotates', function() {
        expect(b.straight.shape).to.include.deep.ordered.members([[0, 0, 0, 0],
                                                                  [1, 1, 1, 1],
                                                                  [0, 0, 0, 0],
                                                                  [0, 0, 0, 0]]);
        b.rotate("right");
        expect(b.straight.shape).to.include.deep.ordered.members([[0, 0, 1, 0],
                                                                  [0, 0, 1, 0],
                                                                  [0, 0, 1, 0],
                                                                  [0, 0, 1, 0]]);
        b.rotate("left");
        b.rotate("left");
        expect(b.straight.shape).to.include.deep.ordered.members([[0, 1, 0, 0],
                                                                  [0, 1, 0, 0],
                                                                  [0, 1, 0, 0],
                                                                  [0, 1, 0, 0]]);
        //b.rotate();
        //expect(b.straight.shape).to.include.deep.ordered.members([[0, 0, 0, 0],
        //                                                          [0, 0, 0, 0],
        //                                                          [1, 1, 1, 1],
        //                                                          [0, 0, 0, 0]]);
        // console.log(b);
    })
})
