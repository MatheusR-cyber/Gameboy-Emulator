class BreakoutGame {
    constructor(canvas, ctx, keys, emulator) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.keys = keys;
        this.emulator = emulator;
        
        this.paddle = {x: 60, y: 135, width: 40, height: 4, speed: 3};
        this.ball = {x: 80, y: 130, radius: 2, vx: 2, vy: -2};
        this.bricks = this.createBricks();
        this.score = 0;
        this.gameWon = false;
    }

    createBricks() {
        const bricks = [];
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 8; col++) {
                bricks.push({
                    x: col * 20,
                    y: row * 10 + 10,
                    width: 18,
                    height: 8,
                    active: true,
                    color: ['#FF0000', '#FFaa00', '#FFFF00'][row]
                });
            }
        }
        return bricks;
    }

    update() {
        if (this.gameWon) return;

        // Controles da raquete
        if (this.keys['ArrowLeft']) {
            this.paddle.x = Math.max(0, this.paddle.x - this.paddle.speed);
        }
        if (this.keys['ArrowRight']) {
            this.paddle.x = Math.min(this.canvas.width - this.paddle.width, this.paddle.x + this.paddle.speed);
        }

        // Movimento da bola
        this.ball.x += this.ball.vx;
        this.ball.y += this.ball.vy;

        // Colisão com paredes
        if (this.ball.x - this.ball.radius < 0 || this.ball.x + this.ball.radius > this.canvas.width) {
            this.ball.vx *= -1;
        }
        if (this.ball.y - this.ball.radius < 0) {
            this.ball.vy *= -1;
        }

        // Game Over
        if (this.ball.y > this.canvas.height) {
            this.emulator.gameOver();
        }

        // Colisão com raquete
        if (this.ball.y + this.ball.radius > this.paddle.y &&
            this.ball.y - this.ball.radius < this.paddle.y + this.paddle.height &&
            this.ball.x > this.paddle.x &&
            this.ball.x < this.paddle.x + this.paddle.width) {
            this.ball.vy *= -1;
            this.ball.y = this.paddle.y - this.ball.radius;
        }

        // Colisão com blocos
        this.bricks.forEach(brick => {
            if (!brick.active) return;

            if (this.ball.x + this.ball.radius > brick.x &&
                this.ball.x - this.ball.radius < brick.x + brick.width &&
                this.ball.y + this.ball.radius > brick.y &&
                this.ball.y - this.ball.radius < brick.y + brick.height) {
                
                brick.active = false;
                this.ball.vy *= -1;
                this.score += 10;
                this.emulator.updateScore(10);

                // Verificar vitória
                if (this.bricks.every(b => !b.active)) {
                    this.gameWon = true;
                }
            }
        });
    }

    draw() {
        this.emulator.clearScreen();

        // Draw paddle
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(this.paddle.x, this.paddle.y, this.paddle.width, this.paddle.height);

        // Draw ball
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fill();

        // Draw bricks
        this.bricks.forEach(brick => {
            if (brick.active) {
                this.ctx.fillStyle = brick.color;
                this.ctx.fillRect(brick.x, brick.y, brick.width, brick.height);
            }
        });

        if (this.gameWon) {
            this.ctx.fillStyle = '#000';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('VOCE VENCEU!', 80, 70);
        }
    }
}