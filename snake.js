class SnakeGame {
    constructor(canvas, ctx, keys, emulator) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.keys = keys;
        this.emulator = emulator;
        
        this.gridSize = 8;
        this.snake = [{x: 5, y: 9}];
        this.direction = {x: 1, y: 0};
        this.nextDirection = {x: 1, y: 0};
        this.food = {x: 10, y: 5};
        this.score = 0;
        this.moveCounter = 0;
        this.lastKey = null;
    }

    update() {
        // Controles
        if (this.keys['ArrowUp'] && this.direction.y === 0) {
            this.nextDirection = {x: 0, y: -1};
            this.lastKey = 'ArrowUp';
        }
        if (this.keys['ArrowDown'] && this.direction.y === 0) {
            this.nextDirection = {x: 0, y: 1};
            this.lastKey = 'ArrowDown';
        }
        if (this.keys['ArrowLeft'] && this.direction.x === 0) {
            this.nextDirection = {x: -1, y: 0};
            this.lastKey = 'ArrowLeft';
        }
        if (this.keys['ArrowRight'] && this.direction.x === 0) {
            this.nextDirection = {x: 1, y: 0};
            this.lastKey = 'ArrowRight';
        }

        this.moveCounter++;
        if (this.moveCounter > 8) {
            this.direction = this.nextDirection;
            const head = {x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y};

            // Colisão com parede
            if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 18) {
                this.emulator.gameOver();
                return;
            }

            // Colisão consigo mesmo
            if (this.snake.some(s => s.x === head.x && s.y === head.y)) {
                this.emulator.gameOver();
                return;
            }

            this.snake.unshift(head);

            // Come comida
            if (head.x === this.food.x && head.y === this.food.y) {
                this.score += 10;
                this.emulator.updateScore(10);
                this.food = {x: Math.floor(Math.random() * 20), y: Math.floor(Math.random() * 18)};
            } else {
                this.snake.pop();
            }

            this.moveCounter = 0;
        }
    }

    draw() {
        this.emulator.clearScreen();

        // Draw food
        this.ctx.fillStyle = '#FF0000';
        this.ctx.fillRect(this.food.x * 8, this.food.y * 8, 8, 8);

        // Draw snake
        this.ctx.fillStyle = '#0F0';
        this.snake.forEach((segment, index) => {
            this.ctx.fillRect(segment.x * 8, segment.y * 8, 8, 8);
            if (index === 0) {
                this.ctx.fillStyle = '#00F';
                this.ctx.fillRect(segment.x * 8 + 2, segment.y * 8 + 2, 4, 4);
            }
        });
    }
}