import {expect} from 'chai'
import Tetromino from "../src/Tetromino";
//import Block from "../src/Block";

describe('TetrisTests', function() {
    let b =  new Tetromino();
    it('rotates', function() {
        expect(b.straight.shape).to.have.ordered.members([ 1, 1, 1, 0 ])
    })
})
