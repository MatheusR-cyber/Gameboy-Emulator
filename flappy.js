class FlappyGame {
    constructor(canvas, ctx, keys, emulator) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.keys = keys;
        this.emulator = emulator;
        
        this.bird = {x: 30, y: 70, width: 8, height: 8, velocity: 0, gravity: 0.3, jump: -6};
        this.pipes = [];
        this.pipeWidth = 20;
        this.pipeGap = 40;
        this.pipeDistance = 60;
        this.lastPipe = 0;
        this.score = 0;
        this.gameOver = false;
    }

    update() {
        if (this.gameOver) return;

        // Jump
        if (this.keys['z'] || this.keys[' ']) {
            this.bird.velocity = this.bird.jump;
        }

        // Apply gravity
        this.bird.velocity += this.bird.gravity;
        this.bird.y += this.bird.velocity;

        // Generate pipes
        if (this.lastPipe > this.pipeDistance) {
            const gap = this.pipeGap;
            const minY = 20;
            const maxY = this.canvas.height - gap - 20;
            const gapY = Math.random() * (maxY - minY) + minY;
            
            this.pipes.push({
                x: this.canvas.width,
                gapY: gapY,
                gap: gap,
                passed: false
            });
            this.lastPipe = 0;
        }
        this.lastPipe++;

        // Update pipes
        this.pipes = this.pipes.filter(pipe => pipe.x > -this.pipeWidth);
        this.pipes.forEach(pipe => {
            pipe.x -= 3;
            
            // Collision detection
            if (this.checkCollision(pipe)) {
                this.gameOver = true;
                this.emulator.gameOver();
            }

            // Score
            if (pipe.x + this.pipeWidth < this.bird.x && !pipe.passed) {
                pipe.passed = true;
                this.score += 10;
                this.emulator.updateScore(10);
            }
        });

        // Collision with floor/ceiling
        if (this.bird.y + this.bird.height > this.canvas.height || this.bird.y < 0) {
            this.gameOver = true;
            this.emulator.gameOver();
        }
    }

    checkCollision(pipe) {
        return (
            this.bird.x + this.bird.width > pipe.x &&
            this.bird.x < pipe.x + this.pipeWidth &&
            (this.bird.y < pipe.gapY || this.bird.y + this.bird.height > pipe.gapY + pipe.gap)
        );
    }

    draw() {
        this.emulator.clearScreen();

        // Draw bird
        this.ctx.fillStyle = '#FFD700';
        this.ctx.fillRect(this.bird.x, this.bird.y, this.bird.width, this.bird.height);
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(this.bird.x + 6, this.bird.y + 2, 2, 2);

        // Draw pipes
        this.ctx.fillStyle = '#00AA00';
        this.pipes.forEach(pipe => {
            // Top pipe
            this.ctx.fillRect(pipe.x, 0, this.pipeWidth, pipe.gapY);
            // Bottom pipe
            this.ctx.fillRect(pipe.x, pipe.gapY + pipe.gap, this.pipeWidth, this.canvas.height - pipe.gapY - pipe.gap);
        });

        if (this.gameOver) {
            this.ctx.fillStyle = '#000';
            this.ctx.font = 'bold 10px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', 80, 70);
        }
    }
}