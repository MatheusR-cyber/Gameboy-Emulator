class TetrisGame {
    constructor(canvas, ctx, keys, emulator) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.keys = keys;
        this.emulator = emulator;
        
        this.gridWidth = 10;
        this.gridHeight = 18;
        this.blockSize = 8;
        this.grid = Array(this.gridHeight).fill().map(() => Array(this.gridWidth).fill(0));
        
        this.pieces = [
            { shape: [[1,1,1,1]], color: '#0FF' }, // I
            { shape: [[1,1],[1,1]], color: '#FF0' }, // O
            { shape: [[0,1,0],[1,1,1]], color: '#F0F' }, // T
            { shape: [[1,0,0],[1,1,1]], color: '#F80' }, // L
            { shape: [[0,0,1],[1,1,1]], color: '#00F' }, // J
            { shape: [[0,1,1],[1,1,0]], color: '#0F0' }, // S
            { shape: [[1,1,0],[0,1,1]], color: '#F00' } // Z
        ];
        
        this.currentPiece = this.getRandomPiece();
        this.nextPiece = this.getRandomPiece();
        this.x = 3;
        this.y = 0;
        this.dropCounter = 0;
        this.score = 0;
        this.lastKey = null;
    }

    getRandomPiece() {
        return structuredClone(this.pieces[Math.floor(Math.random() * this.pieces.length)]);
    }

    update() {
        // Controles
        if (this.keys['ArrowLeft'] && this.lastKey !== 'ArrowLeft') {
            this.x--;
            this.lastKey = 'ArrowLeft';
            if (this.collides()) this.x++;
        }
        if (this.keys['ArrowRight'] && this.lastKey !== 'ArrowRight') {
            this.x++;
            this.lastKey = 'ArrowRight';
            if (this.collides()) this.x--;
        }
        if (this.keys['z'] && this.lastKey !== 'z') {
            this.rotate();
            this.lastKey = 'z';
        }
        if (!this.keys['ArrowLeft'] && !this.keys['ArrowRight'] && !this.keys['z']) {
            this.lastKey = null;
        }

        this.dropCounter++;
        if (this.dropCounter > 30 || this.keys['ArrowDown']) {
            if (!this.moveDown()) {
                this.mergePiece();
                this.clearLines();
                this.currentPiece = this.nextPiece;
                this.nextPiece = this.getRandomPiece();
                this.x = 3;
                this.y = 0;
                if (this.collides()) {
                    this.emulator.gameOver();
                }
            }
            this.dropCounter = 0;
        }
    }

    moveDown() {
        this.y++;
        if (this.collides()) {
            this.y--;
            return false;
        }
        return true;
    }

    collides() {
        for (let r = 0; r < this.currentPiece.shape.length; r++) {
            for (let c = 0; c < this.currentPiece.shape[r].length; c++) {
                if (!this.currentPiece.shape[r][c]) continue;
                
                const x = this.x + c;
                const y = this.y + r;
                
                if (x < 0 || x >= this.gridWidth || y >= this.gridHeight) return true;
                if (y >= 0 && this.grid[y][x]) return true;
            }
        }
        return false;
    }

    rotate() {
        const original = structuredClone(this.currentPiece.shape);
        this.currentPiece.shape = this.currentPiece.shape[0].map((_, i) =>
            this.currentPiece.shape.map(row => row[i]).reverse()
        );
        if (this.collides()) {
            this.currentPiece.shape = original;
        }
    }

    mergePiece() {
        for (let r = 0; r < this.currentPiece.shape.length; r++) {
            for (let c = 0; c < this.currentPiece.shape[r].length; c++) {
                if (this.currentPiece.shape[r][c]) {
                    const x = this.x + c;
                    const y = this.y + r;
                    if (y >= 0) this.grid[y][x] = this.currentPiece.color;
                }
            }
        }
    }

    clearLines() {
        for (let r = this.gridHeight - 1; r >= 0; r--) {
            if (this.grid[r].every(cell => cell)) {
                this.grid.splice(r, 1);
                this.grid.unshift(Array(this.gridWidth).fill(0));
                this.score += 100;
                this.emulator.updateScore(100);
            }
        }
    }

    draw() {
        this.emulator.clearScreen();

        // Draw grid
        for (let r = 0; r < this.gridHeight; r++) {
            for (let c = 0; c < this.gridWidth; c++) {
                if (this.grid[r][c]) {
                    this.ctx.fillStyle = this.grid[r][c];
                    this.ctx.fillRect(c * this.blockSize, r * this.blockSize, this.blockSize - 1, this.blockSize - 1);
                }
            }
        }

        // Draw current piece
        for (let r = 0; r < this.currentPiece.shape.length; r++) {
            for (let c = 0; c < this.currentPiece.shape[r].length; c++) {
                if (this.currentPiece.shape[r][c]) {
                    this.ctx.fillStyle = this.currentPiece.color;
                    this.ctx.fillRect((this.x + c) * this.blockSize, (this.y + r) * this.blockSize, this.blockSize - 1, this.blockSize - 1);
                }
            }
        }
    }
}