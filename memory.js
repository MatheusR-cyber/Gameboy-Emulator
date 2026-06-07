class MemoryGame {
    constructor(canvas, ctx, keys, emulator) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.keys = keys;
        this.emulator = emulator;
        
        this.cards = this.createCards();
        this.selectedCards = [];
        this.matchedPairs = 0;
        this.moves = 0;
        this.gameWon = false;
        this.lastKey = null;
        this.selectedIndex = 0;
    }

    createCards() {
        const symbols = ['🌟', '❤️', '🎈', '🎁', '🍎', '⭐', '🎯', '🔥'];
        let cards = [...symbols, ...symbols].sort(() => Math.random() - 0.5);
        return cards.map((symbol, i) => ({
            symbol,
            flipped: false,
            matched: false,
            index: i
        }));
    }

    update() {
        if (this.gameWon) return;

        // Controles de navegação
        if (this.keys['ArrowLeft'] && this.lastKey !== 'ArrowLeft') {
            this.selectedIndex = (this.selectedIndex - 1 + 16) % 16;
            this.lastKey = 'ArrowLeft';
        }
        if (this.keys['ArrowRight'] && this.lastKey !== 'ArrowRight') {
            this.selectedIndex = (this.selectedIndex + 1) % 16;
            this.lastKey = 'ArrowRight';
        }
        if (this.keys['ArrowUp'] && this.lastKey !== 'ArrowUp') {
            this.selectedIndex = (this.selectedIndex - 4 + 16) % 16;
            this.lastKey = 'ArrowUp';
        }
        if (this.keys['ArrowDown'] && this.lastKey !== 'ArrowDown') {
            this.selectedIndex = (this.selectedIndex + 4) % 16;
            this.lastKey = 'ArrowDown';
        }

        if (!this.keys['ArrowLeft'] && !this.keys['ArrowRight'] && 
            !this.keys['ArrowUp'] && !this.keys['ArrowDown']) {
            this.lastKey = null;
        }

        // Selecionar carta
        if (this.keys['z'] && this.lastKey !== 'z') {
            this.selectCard(this.selectedIndex);
            this.lastKey = 'z';
        }
        if (!this.keys['z']) {
            this.lastKey = null;
        }

        // Verificar match
        if (this.selectedCards.length === 2) {
            if (this.cards[this.selectedCards[0]].symbol === this.cards[this.selectedCards[1]].symbol) {
                this.cards[this.selectedCards[0]].matched = true;
                this.cards[this.selectedCards[1]].matched = true;
                this.matchedPairs++;
                this.emulator.updateScore(50);
                this.selectedCards = [];
                
                if (this.matchedPairs === 8) {
                    this.gameWon = true;
                }
            } else {
                setTimeout(() => {
                    this.cards[this.selectedCards[0]].flipped = false;
                    this.cards[this.selectedCards[1]].flipped = false;
                    this.selectedCards = [];
                }, 1000);
            }
            this.moves++;
        }
    }

    selectCard(index) {
        if (!this.cards[index].flipped && !this.cards[index].matched && this.selectedCards.length < 2) {
            this.cards[index].flipped = true;
            this.selectedCards.push(index);
        }
    }

    draw() {
        this.emulator.clearScreen();

        const cardWidth = 20;
        const cardHeight = 18;
        const padding = 2;

        for (let i = 0; i < 16; i++) {
            const x = (i % 4) * (cardWidth + padding);
            const y = Math.floor(i / 4) * (cardHeight + padding);
            const card = this.cards[i];

            // Draw card
            if (i === this.selectedIndex) {
                this.ctx.fillStyle = '#FF00FF';
            } else if (card.matched) {
                this.ctx.fillStyle = '#00FF00';
            } else {
                this.ctx.fillStyle = '#808080';
            }
            this.ctx.fillRect(x, y, cardWidth, cardHeight);

            // Draw border
            this.ctx.strokeStyle = '#000';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(x, y, cardWidth, cardHeight);

            // Draw symbol if flipped
            if (card.flipped || card.matched) {
                this.ctx.fillStyle = '#FFF';
                this.ctx.font = '10px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.textBaseline = 'middle';
                this.ctx.fillText(card.symbol, x + cardWidth / 2, y + cardHeight / 2);
            }
        }

        if (this.gameWon) {
            this.ctx.fillStyle = '#000';
            this.ctx.font = 'bold 12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GANHOU!', 80, 70);
        }
    }
}