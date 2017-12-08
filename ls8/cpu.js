const INIT = 0b00000001;
const SET  = 0b00000010;
const SAVE = 0b00000100;
const MUL  = 0b00000101;
const PRN  = 0b00000110;
const HALT = 0b00000000;
const SUB  = 0b00001101;
const ADD  = 0b00001111;
const DIV  = 0b00001001;
const INC  = 0b00001011;
const DEC  = 0b00010001;
const PUSH = 0b00011001;
const POP  = 0b00011101;

const SP = 0xff;




/**
 * Beej's debug console log trick
 */
function debug(e){
    // console.log(e)
}


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
            [DIV]: this.DIV,
            [INC]: this.INC,
            [DEC]: this.DEC,
            [PUSH]: this.PUSH,
            [POP]: this.POP,
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
     * Implemented ALU to make life easier
     */

    alu(OP, R0, R1){
        let regVal0, regVal1;

        switch(OP){
            case 'MUL':
                regVal0 = this.reg[R0];
                regVal1 = this.reg[R1];
                console.log("MUL " + regVal0 + " " +regVal1);

                this.reg[this.curReg] = regVal0 * regVal1;
                break;

            case 'SUB':
                regVal0 = this.reg[R0];
                regVal1 = this.reg[R1];
                console.log("SUB " + regVal0 + " " +regVal1);

                this.reg[this.curReg] = regVal0 - regVal1;
                break;
            
            case 'ADD':
                regVal0 = this.reg[R0];
                regVal1 = this.reg[R1];
                console.log("ADD " + regVal0 + " " +regVal1);



                this.reg[this.curReg] = regVal0 + regVal1;
                break;

            case 'DIV':
                regVal0 = this.reg[R0];
                regVal1 = this.reg[R1];

                if(regVal1 === 0){
                    console.log("Error: Cannot Divide By 0")
                    this.stopClock();
                }
                console.log("DIV " + regVal0 + " " +regVal1);

                this.reg[this.curReg] = regVal0 / regVal1;
                break;

            case 'INC':
                regVal0 = this.reg[R0] + 1;
                if (regVal0 > 255) {regVal0 = 0}
                this.reg[R0] = regVal0;
                break;
            
            case 'DEC':
                regVal0 = this.reg[R0] - 1;
                if (regVal0 < 0) {regVal0 = 255}
                this.reg[R0] = regVal0;
                break;
        }
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

        // this.reg.PC++; // go to next instruction
        this.alu('INC', 'PC');
    }

    /**
     * Handle SET
     */
    SET() {
        const reg = this.mem[this.reg.PC + 1];
        // console.log("SET " + reg);
        debug("SET " + reg)

        this.curReg = reg;

        // this.reg.PC += 2;  // go to next instruction
        this.alu('INC', 'PC');
        this.alu('INC', 'PC');
    }

    /**
     * Handle SAVE
     */
    SAVE() {
        const val = this.mem[this.reg.PC + 1];
        // console.log("SAVE " + val);
        debug("SAVE " + val)
        // Store the value in the current register
        this.reg[this.curReg] = val;
        // this.reg.PC += 2;  // go to next instruction
        this.alu('INC', 'PC');
        this.alu('INC', 'PC');
    }

    /**
     * Handle MUL
     */
    MUL() {
        const reg1 = this.mem[this.reg.PC + 1];
        const reg2 = this.mem[this.reg.PC + 2];

        // const regVal0 = this.reg[reg1]
        // const regVal1 = this.reg[reg2]

        
        this.alu('MUL', reg1, reg2);

        this.alu('INC', 'PC');
        this.alu('INC', 'PC');
        this.alu('INC', 'PC');
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

     /**
     * Handle HALT
     */


    SUB() {
        const reg1 = this.mem[this.reg.PC + 1];
        const reg2 = this.mem[this.reg.PC + 2];

        // console.log("SUB " + regVal0 + " " +regVal1);
        this.alu('SUB', reg1, reg2);
        
        this.alu('INC', 'PC');
        this.alu('INC', 'PC');
        this.alu('INC', 'PC');
    }

    ADD() {
        const reg1 = this.mem[this.reg.PC + 1];
        const reg2 = this.mem[this.reg.PC + 2];

        // console.log("ADD " + regVal0 + " " +regVal1);
        this.alu('ADD', reg1, reg2);
        
        this.alu('INC', 'PC');
        this.alu('INC', 'PC');
        this.alu('INC', 'PC');
    }

    DIV() {
        const reg1 = this.mem[this.reg.PC + 1];
        const reg2 = this.mem[this.reg.PC + 2];

        // const regVal1 = this.reg[reg2]
        // if(regVal1 === 0){
        //     console.log("Cannot Divide By 0")
        //     this.stopClock();
        // }
        // else{

        this.alu('DIV', reg1, reg2);
        // console.log("DIV " + regVal0 + " " +regVal1);

        this.alu('INC', 'PC');
        this.alu('INC', 'PC');
        this.alu('INC', 'PC');
        // }
    }

    // INC() {
    //     this.reg.PC ++
    //     }
    

    // DEC() {
    //     this.reg.PC --
    // }

    PUSH() {
        this.reg.PC ++
        }
    

    POP() {
        this.reg.PC --
    }
    
    
}

module.exports = CPU;