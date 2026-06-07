// Game Boy Emulator Core
class GameBoyEmulator {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.currentGame = 'tetris';
        this.keys = {};
        this.score = 0;
        this.gameRunning = true;

        this.setupEventListeners();
        this.startGame('tetris');
    }

    setupEventListeners() {
        // Teclado
        document.addEventListener('keydown', (e) => {
            this.keys[e.key] = true;
        });

        document.addEventListener('keyup', (e) => {
            this.keys[e.key] = false;
        });

        // Botões do Game Boy
        document.querySelectorAll('.dpad-btn, .btn-a, .btn-b, .btn-select, .btn-start').forEach(btn => {
            btn.addEventListener('mousedown', () => {
                this.keys[btn.dataset.key] = true;
            });
            btn.addEventListener('mouseup', () => {
                this.keys[btn.dataset.key] = false;
            });
            btn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                this.keys[btn.dataset.key] = true;
            });
            btn.addEventListener('touchend', (e) => {
                e.preventDefault();
                this.keys[btn.dataset.key] = false;
            });
        });

        // Seleção de jogo
        document.querySelectorAll('.game-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const game = btn.dataset.game;
                this.switchGame(game);
            });
        });

        // Reset
        document.getElementById('resetBtn').addEventListener('click', () => {
            this.startGame(this.currentGame);
        });
    }

    switchGame(gameName) {
        this.currentGame = gameName;
        this.gameRunning = true;
        document.querySelectorAll('.game-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-game="${gameName}"]`).classList.add('active');
        document.getElementById('currentGame').innerHTML = `Carregado: <strong>${this.getGameName(gameName)}</strong>`;
        this.startGame(gameName);
    }

    getGameName(game) {
        const names = {
            'tetris': 'Tetris',
            'snake': 'Snake',
            'memory': 'Memory',
            'flappy': 'Flappy Bird',
            'breakout': 'Breakout'
        };
        return names[game] || game;
    }

    startGame(game) {
        this.score = 0;
        this.updateScore();
        
        switch(game) {
            case 'tetris':
                this.game = new TetrisGame(this.canvas, this.ctx, this.keys, this);
                break;
            case 'snake':
                this.game = new SnakeGame(this.canvas, this.ctx, this.keys, this);
                break;
            case 'memory':
                this.game = new MemoryGame(this.canvas, this.ctx, this.keys, this);
                break;
            case 'flappy':
                this.game = new FlappyGame(this.canvas, this.ctx, this.keys, this);
                break;
            case 'breakout':
                this.game = new BreakoutGame(this.canvas, this.ctx, this.keys, this);
                break;
        }
        
        this.gameLoop();
    }

    gameLoop() {
        if (!this.gameRunning) return;
        
        this.game.update();
        this.game.draw();
        
        requestAnimationFrame(() => this.gameLoop());
    }

    updateScore(points = 0) {
        this.score += points;
        document.getElementById('gameScore').innerHTML = `Pontuação: <strong>${this.score}</strong>`;
    }

    drawText(text, x, y, size = 16) {
        this.ctx.fillStyle = '#000';
        this.ctx.font = `${size}px Arial`;
        this.ctx.fillText(text, x, y);
    }

    clearScreen() {
        this.ctx.fillStyle = '#d0e000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    gameOver() {
        this.gameRunning = false;
    }
}

// Iniciar emulador quando a página carregar
window.addEventListener('DOMContentLoaded', () => {
    const emulator = new GameBoyEmulator();
});