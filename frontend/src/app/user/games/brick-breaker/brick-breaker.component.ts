import { Component, ElementRef, ViewChild, AfterViewInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../../core/services/game.service';
import { FxService } from '../../../core/services/fx.service';
import confetti from 'canvas-confetti';

@Component({
    selector: 'app-brick-breaker',
    standalone: true,
    imports: [CommonModule],
    providers: [FxService],
    template: `
    <div class="game-view animate-fade-in">
      <div class="game-hud">
        <div class="stat-pills">
          <div class="pill neon-border glass">OP: <span class="glow-blue">BREAKOUT</span></div>
          <div class="pill neon-border glass">POWER: <span class="glow-pink">{{score}}</span></div>
        </div>
      </div>

      <div class="canvas-container neon-border glass">
        <canvas #gameCanvas width="600" height="400"></canvas>
        <div class="overlay" *ngIf="!gameStarted">
          <h2 class="orbitron glow-blue">{{ gameEnded ? 'MISSION COMPLETE' : 'CORE BREACH READY' }}</h2>
          <button class="neon-btn" (click)="startGame()">
            {{ gameEnded ? 'REINITIALIZE' : 'LAUNCH CORE' }}
          </button>
        </div>
      </div>

      <div class="game-footer">
        <p class="controls-hint text-dim"><i class="bi bi-mouse"></i> SYNCED TO MOUSE MOVEMENT</p>
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
    .canvas-container { position: relative; border-radius: 24px; overflow: hidden; background: #08080a; cursor: none; }
    .overlay {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(10px);
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 2rem; z-index: 10;
    }
    .neon-btn {
      background: rgba(0, 242, 255, 0.1); border: 2px solid #00f2ff; color: #00f2ff; padding: 1rem 2.5rem; border-radius: 12px; font-family: 'Orbitron'; font-weight: 800; cursor: pointer; transition: all 0.3s;
      &:hover { background: #00f2ff; color: #000; box-shadow: 0 0 30px #00f2ff; }
    }
    .controls-hint { font-size: 0.8rem; letter-spacing: 2px; font-weight: 700; }
  `]
})
export class BrickBreakerComponent implements AfterViewInit, OnDestroy {
    @ViewChild('gameCanvas') canvas!: ElementRef<HTMLCanvasElement>;
    private ctx!: CanvasRenderingContext2D;
    public gameService = inject(GameService);
    public fx = inject(FxService);

    score = 0;
    gameStarted = false;
    gameEnded = false;

    private ball = { x: 300, y: 350, dx: 4, dy: -4, radius: 8 };
    private paddle = { h: 10, w: 100, x: 250 };
    private brick = { rows: 5, cols: 7, w: 75, h: 20, padding: 10, offsetTop: 50, offsetLeft: 10 };
    private bricks: any[] = [];
    private animationId: any;

    ngAfterViewInit() {
        this.ctx = this.canvas.nativeElement.getContext('2d')!;
        this.initBricks();
        this.render();
    }

    ngOnDestroy() {
        cancelAnimationFrame(this.animationId);
    }

    private initBricks() {
        this.bricks = [];
        for (let c = 0; c < this.brick.cols; c++) {
            this.bricks[c] = [];
            for (let r = 0; r < this.brick.rows; r++) {
                this.bricks[c][r] = { x: 0, y: 0, status: 1, color: this.getBrickColor(r) };
            }
        }
    }

    private getBrickColor(row: number) {
        const colors = ['#ff00c8', '#7000ff', '#00f2ff', '#00ff88', '#ffcc00'];
        return colors[row % colors.length];
    }

    startGame() {
        this.fx.playSelect();
        this.score = 0;
        this.gameStarted = true;
        this.gameEnded = false;
        this.ball = { x: 300, y: 350, dx: 4, dy: -4, radius: 8 };
        this.initBricks();
        this.animationLoop();
        document.addEventListener('mousemove', this.movePaddle.bind(this));
    }

    private movePaddle(e: MouseEvent) {
        const rect = this.canvas.nativeElement.getBoundingClientRect();
        const relativeX = e.clientX - rect.left;
        if (relativeX > 0 && relativeX < 600) {
            this.paddle.x = relativeX - this.paddle.w / 2;
        }
    }

    private animationLoop() {
        this.update();
        this.render();
        if (this.gameStarted) {
            this.animationId = requestAnimationFrame(() => this.animationLoop());
        }
    }

    private update() {
        // Ball movement
        this.ball.x += this.ball.dx;
        this.ball.y += this.ball.dy;

        // Wall collision
        if (this.ball.x + this.ball.radius > 600 || this.ball.x - this.ball.radius < 0) {
            this.ball.dx = -this.ball.dx;
            this.fx.playMove();
        }
        if (this.ball.y - this.ball.radius < 0) {
            this.ball.dy = -this.ball.dy;
            this.fx.playMove();
        } else if (this.ball.y + this.ball.radius > 400) {
            if (this.ball.x > this.paddle.x && this.ball.x < this.paddle.x + this.paddle.w) {
                this.ball.dy = -this.ball.dy;
                this.fx.playMove();
                // Add spin
                this.ball.dx = 8 * ((this.ball.x - (this.paddle.x + this.paddle.w / 2)) / this.paddle.w);
            } else {
                this.handleGameOver(false);
            }
        }

        // Brick collision
        for (let c = 0; c < this.brick.cols; c++) {
            for (let r = 0; r < this.brick.rows; r++) {
                const b = this.bricks[c][r];
                if (b.status === 1) {
                    if (this.ball.x > b.x && this.ball.x < b.x + this.brick.w && this.ball.y > b.y && this.ball.y < b.y + this.brick.h) {
                        this.ball.dy = -this.ball.dy;
                        b.status = 0;
                        this.score += 20;
                        this.fx.playSuccess();
                        if (this.bricks.every(col => col.every((brick: any) => brick.status === 0))) {
                            this.handleGameOver(true);
                        }
                    }
                }
            }
        }
    }

    private render() {
        this.ctx.fillStyle = '#08080a';
        this.ctx.fillRect(0, 0, 600, 400);

        // Draw Bricks with Glow
        this.ctx.shadowBlur = 10;
        for (let c = 0; c < this.brick.cols; c++) {
            for (let r = 0; r < this.brick.rows; r++) {
                const b = this.bricks[c][r];
                if (b.status === 1) {
                    b.x = c * (this.brick.w + this.brick.padding) + this.brick.offsetLeft;
                    b.y = r * (this.brick.h + this.brick.padding) + this.brick.offsetTop;
                    this.ctx.fillStyle = b.color;
                    this.ctx.shadowColor = b.color;
                    this.roundRect(b.x, b.y, this.brick.w, this.brick.h, 4);
                }
            }
        }

        // Draw Paddle
        this.ctx.shadowColor = '#00f2ff';
        this.ctx.fillStyle = '#00f2ff';
        this.roundRect(this.paddle.x, 390, this.paddle.w, this.paddle.h, 5);

        // Draw Ball
        this.ctx.shadowColor = '#fff';
        this.ctx.fillStyle = '#fff';
        this.ctx.beginPath();
        this.ctx.arc(this.ball.x, this.ball.y, this.ball.radius, 0, Math.PI * 2);
        this.ctx.fill();
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

    private handleGameOver(win: boolean) {
        this.gameStarted = false;
        this.gameEnded = true;
        cancelAnimationFrame(this.animationId);
        this.gameService.submitScore({ gameName: 'Brick Breaker', score: this.score }).subscribe();
        if (win) {
            this.fx.playSuccess();
            confetti({ particleCount: 200, spread: 100, colors: ['#00f2ff', '#ff00c8'] });
        } else {
            this.fx.playError();
        }
    }
}

