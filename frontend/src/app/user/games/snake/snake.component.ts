import { Component, ElementRef, ViewChild, AfterViewInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../../core/services/game.service';
import { FxService } from '../../../core/services/fx.service';

@Component({
    selector: 'app-snake',
    standalone: true,
    imports: [CommonModule],
    providers: [FxService],
    template: `
    <div class="game-view animate-fade-in">
      <div class="game-hud">
        <div class="stat-pills">
          <div class="pill neon-border glass">NAME: <span class="glow-blue">SNAKE OPS</span></div>
          <div class="pill neon-border glass">SCORE: <span class="glow-pink">{{score}}</span></div>
        </div>
      </div>

      <div class="canvas-container neon-border glass">
        <canvas #gameCanvas width="500" height="500"></canvas>
        <div class="overlay" *ngIf="!gameRunning">
          <h2 class="orbitron glow-blue">{{ gameOver ? 'MISSION FAILED' : 'READY TO DEPLOY?' }}</h2>
          <button class="neon-btn" (click)="startGame()">
            {{ gameOver ? 'RETRY MISSION' : 'START LINK' }}
          </button>
        </div>
      </div>

      <div class="game-footer">
        <p class="controls-hint text-dim"><i class="bi bi-keyboard"></i> USE ARROW KEYS TO NAVIGATION</p>
      </div>
    </div>
  `,
    styles: [`
    .game-view { display: flex; flex-direction: column; align-items: center; gap: 2rem; }
    .stat-pills { display: flex; gap: 1rem; }
    .pill { 
      padding: 0.6rem 1.5rem; border-radius: 12px; font-family: 'Orbitron'; font-size: 0.8rem;
      span { font-weight: 800; margin-left: 10px; }
    }

    .canvas-container { 
      position: relative; border-radius: 20px; box-shadow: 0 0 50px rgba(0,0,0,0.6); overflow: hidden;
      background: #08080a;
    }
    
    canvas { display: block; }

    .overlay {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0;
      background: rgba(0,0,0,0.8); backdrop-filter: blur(8px);
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem;
      z-index: 10;
    }

    .neon-btn {
      background: rgba(0, 242, 255, 0.1); border: 2px solid #00f2ff; color: #00f2ff;
      padding: 1rem 2.5rem; border-radius: 12px; font-family: 'Orbitron'; font-weight: 800;
      cursor: pointer; transition: all 0.3s;
      &:hover { background: #00f2ff; color: #000; box-shadow: 0 0 30px #00f2ff; }
    }

    .controls-hint { font-size: 0.8rem; letter-spacing: 2px; font-weight: 700; i { color: #00f2ff; } }
  `]
})
export class SnakeComponent implements AfterViewInit, OnDestroy {
    @ViewChild('gameCanvas') canvas!: ElementRef<HTMLCanvasElement>;
    private ctx!: CanvasRenderingContext2D;
    public gameService = inject(GameService);
    public fx = inject(FxService);

    score = 0;
    gameRunning = false;
    gameOver = false;

    private snake: { x: number, y: number }[] = [];
    private food = { x: 0, y: 0 };
    private direction = { x: 1, y: 0 };
    private nextDirection = { x: 1, y: 0 };
    private gridSize = 25;
    private tileCount = 20;
    private gameLoop: any;

    ngAfterViewInit() {
        this.ctx = this.canvas.nativeElement.getContext('2d')!;
        this.drawStatic();
        window.addEventListener('keydown', this.handleInput.bind(this));
    }

    ngOnDestroy() {
        this.stopGame();
        window.removeEventListener('keydown', this.handleInput.bind(this));
    }

    private drawStatic() {
        this.ctx.fillStyle = '#08080a';
        this.ctx.fillRect(0, 0, 500, 500);
        // Draw grid lines
        this.ctx.strokeStyle = 'rgba(255,255,255,0.02)';
        for (let i = 0; i < 500; i += this.gridSize) {
            this.ctx.beginPath(); this.ctx.moveTo(i, 0); this.ctx.lineTo(i, 500); this.ctx.stroke();
            this.ctx.beginPath(); this.ctx.moveTo(0, i); this.ctx.lineTo(500, i); this.ctx.stroke();
        }
    }

    startGame() {
        this.fx.playSelect();
        this.score = 0;
        this.gameOver = false;
        this.gameRunning = true;
        this.snake = [{ x: 10, y: 10 }, { x: 9, y: 10 }, { x: 8, y: 10 }];
        this.direction = { x: 1, y: 0 };
        this.nextDirection = { x: 1, y: 0 };
        this.spawnFood();

        if (this.gameLoop) clearInterval(this.gameLoop);
        this.gameLoop = setInterval(() => this.update(), 120);
    }

    private stopGame() {
        this.gameRunning = false;
        if (this.gameLoop) clearInterval(this.gameLoop);
    }

    private handleInput(e: KeyboardEvent) {
        const key = e.key;
        if (key === 'ArrowUp' && this.direction.y === 0) this.nextDirection = { x: 0, y: -1 };
        if (key === 'ArrowDown' && this.direction.y === 0) this.nextDirection = { x: 0, y: 1 };
        if (key === 'ArrowLeft' && this.direction.x === 0) this.nextDirection = { x: -1, y: 0 };
        if (key === 'ArrowRight' && this.direction.x === 0) this.nextDirection = { x: 1, y: 0 };
    }

    private spawnFood() {
        this.food = {
            x: Math.floor(Math.random() * this.tileCount),
            y: Math.floor(Math.random() * this.tileCount)
        };
        // Don't spawn on snake
        if (this.snake.some(s => s.x === this.food.x && s.y === this.food.y)) this.spawnFood();
    }

    private update() {
        this.direction = this.nextDirection;
        const head = { x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y };

        // Collisions
        if (head.x < 0 || head.x >= this.tileCount || head.y < 0 || head.y >= this.tileCount ||
            this.snake.some(s => s.x === head.x && s.y === head.y)) {
            this.handleGameOver();
            return;
        }

        this.snake.unshift(head);

        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.fx.playSuccess();
            this.spawnFood();
        } else {
            this.snake.pop();
        }

        this.render();
    }

    private render() {
        this.ctx.fillStyle = '#08080a';
        this.ctx.fillRect(0, 0, 500, 500);
        this.drawStatic();

        // Draw Food with Glow
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = '#ff00c8';
        this.ctx.fillStyle = '#ff00c8';
        this.ctx.beginPath();
        this.ctx.arc(this.food.x * this.gridSize + this.gridSize / 2, this.food.y * this.gridSize + this.gridSize / 2, 8, 0, Math.PI * 2);
        this.ctx.fill();

        // Draw Snake with Gradient
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = '#00f2ff';
        this.snake.forEach((s, i) => {
            const alpha = 1 - (i / this.snake.length) * 0.6;
            this.ctx.fillStyle = `rgba(0, 242, 255, ${alpha})`;
            const size = this.gridSize - 4;
            this.roundRect(s.x * this.gridSize + 2, s.y * this.gridSize + 2, size, size, 5);
        });
        this.ctx.shadowBlur = 0;
    }

    private roundRect(x: number, y: number, w: number, h: number, r: number) {
        this.ctx.beginPath();
        this.ctx.moveTo(x + r, y);
        this.ctx.arcTo(x + w, y, x + w, y + h, r);
        this.ctx.arcTo(x + w, y + h, x, y + h, r);
        this.ctx.arcTo(x, y + h, x, y, r);
        this.ctx.arcTo(x, y, x + w, y, r);
        this.ctx.closePath();
        this.ctx.fill();
    }

    private handleGameOver() {
        this.fx.playError();
        this.gameOver = true;
        this.stopGame();
        this.gameService.submitScore({ gameName: 'Snake', score: this.score }).subscribe();
    }
}

