const INIT = 0b00000001;
const SET  = 0b00000010;
const SAVE = 0b00000100;
const MUL  = 0b00000101;
const PRN  = 0b00000110;
const HALT = 0b00000000;
const SUB  = 0b00001101;
const ADD  = 0b00001111;
const DIV  = 0b00001001;


class CPU {
    constructor() {
        this.mem = new Array(256);
        this.mem.fill(0);

        this.curReg = 0;
        this.reg = new Array(256);
        this.reg.fill(0);

        this.reg.PC = 0;

        this.buildBranchTable();
    }

    /**
     * Build the branch table
     */
    buildBranchTable() {
        this.branchTable = {
            [INIT]: this.INIT,
            [SET]: this.SET,
            [SAVE]: this.SAVE,
            [MUL]: this.MUL,
            [PRN]: this.PRN,
            [HALT]: this.HALT,

            [SUB]: this.SUB,
            [ADD]: this.ADD,
            [DIV]: this.DIV
        };
    }

    /**
     * Poke values into memory
     */
    poke(address, value) {
        this.mem[address] = value;
    }

    /**
     * start the clock
     */
    startClock() {
        this.clock = setInterval(() => { this.tick(); }, 250);
    }

    /**
     * Stop the clock
     */
    stopClock() {
        clearInterval(this.clock);
    }

    /**
     * Each tick of the clock
     */
    tick() {
        // Run the instructions
        const currentInstruction = this.mem[this.reg.PC];

        const handler = this.branchTable[currentInstruction];

        if (handler === undefined) {
            console.error("ERROR: invalid instruction " + currentInstruction);
            this.stopClock();
            return;
        }

        handler.call(this);  // set this explicitly in handler
    }

    /**
     * Handle INIT
     */
    INIT() {
        console.log("INIT");
        this.curReg = 0;

        this.reg.PC++; // go to next instruction
    }

    /**
     * Handle SET
     */
    SET() {
        const reg = this.mem[this.reg.PC + 1];
        console.log("SET " + reg);

        this.curReg = reg;

        this.reg.PC += 2;  // go to next instruction
    }

    /**
     * Handle SAVE
     */
    SAVE() {
        const val = this.mem[this.reg.PC + 1];
        console.log("SAVE " + val);
        // Store the value in the current register
        this.reg[this.curReg] = val;
        this.reg.PC += 2;  // go to next instruction
    }

    /**
     * Handle MUL
     */
    MUL() {
        const reg1 = this.mem[this.reg.PC + 1];
        const reg2 = this.mem[this.reg.PC + 2];
        const regVal0 = this.reg[reg1]
        const regVal1 = this.reg[reg2]
        // const prod =  this.reg[0] *= this.reg[1]
        this.reg[this.curReg] = regVal0 * regVal1;
        console.log("MUL " + regVal0 + " " +regVal1);
        this.reg.PC += 3; 
    }

    /**
     * Handle PRN
     */
    PRN() {
        console.log("PRN " + this.reg[this.curReg]);
        this.reg.PC ++; 
    }

     /**
     * Handle HALT
     */

    HALT() {
        console.log("HALT")
        this.stopClock();
    }

    SUB() {
        const reg1 = this.mem[this.reg.PC + 1];
        const reg2 = this.mem[this.reg.PC + 2];
        const regVal0 = this.reg[reg1]
        const regVal1 = this.reg[reg2]
        // const prod =  this.reg[0] *= this.reg[1]
        this.reg[this.curReg] = regVal0 - regVal1;
        console.log("SUB " + regVal0 + " " +regVal1);
        this.reg.PC += 3; 
    }

    ADD() {
        const reg1 = this.mem[this.reg.PC + 1];
        const reg2 = this.mem[this.reg.PC + 2];
        const regVal0 = this.reg[reg1]
        const regVal1 = this.reg[reg2]
        // const prod =  this.reg[0] *= this.reg[1]
        this.reg[this.curReg] = regVal0 + regVal1;
        console.log("ADD " + regVal0 + " " +regVal1);
        this.reg.PC += 3; 
    }

    DIV() {
        const reg1 = this.mem[this.reg.PC + 1];
        const reg2 = this.mem[this.reg.PC + 2];
        const regVal0 = this.reg[reg1]
        const regVal1 = this.reg[reg2]
        // const prod =  this.reg[0] *= this.reg[1]
        if(regVal1 === 0){
            console.log("Cannot Divide By 0")
            this.stopClock();
        }
        else{
        this.reg[this.curReg] = regVal0 / regVal1;
        console.log("DIV " + regVal0 + " " +regVal1);
        this.reg.PC += 3; 
        }
    }
    
    
}

module.exports = CPU;