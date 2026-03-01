import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { GameService } from '../../../core/services/game.service';
import { FxService } from '../../../core/services/fx.service';
import confetti from 'canvas-confetti';

interface Tile {
    val: number;
    id: number;
}

@Component({
    selector: 'app-game-2048',
    standalone: true,
    imports: [CommonModule],
    providers: [FxService],
    template: `
    <div class="game-view animate-fade-in">
      <div class="game-header">
        <h2 class="orbitron glow-blue">CORE MERGE</h2>
        <div class="score-pills">
           <div class="pill neon-border">SCORE: <span class="glow-pink">{{score}}</span></div>
        </div>
      </div>

      <div class="grid-container neon-border glass">
        <div *ngFor="let row of board" class="grid-row">
          <div *ngFor="let tile of row" class="grid-cell">
            <div *ngIf="tile !== 0" 
                 class="tile animate-pop" 
                 [attr.data-value]="tile">
              {{ tile }}
            </div>
          </div>
        </div>
        <div class="overlay" *ngIf="gameOver">
           <h2 class="orbitron glow-pink">PROCESS HALTED</h2>
           <button class="neon-btn" (click)="resetGame()">REBOOT</button>
        </div>
      </div>

      <p class="controls-hint text-dim"><i class="bi bi-keyboard"></i> ARROW KEYS TO MERGE CORES</p>
    </div>
  `,
    styles: [`
    .game-view { display: flex; flex-direction: column; align-items: center; gap: 2rem; }
    .score-pills { display: flex; gap: 1rem; margin-top: 1rem; }
    .pill { padding: 0.5rem 1.5rem; border-radius: 12px; font-family: 'Orbitron'; font-size: 0.8rem; }
    
    .grid-container { 
      padding: 12px; border-radius: 16px; background: rgba(0,0,0,0.5); 
      display: flex; flex-direction: column; gap: 12px; position: relative;
    }
    .grid-row { display: flex; gap: 12px; }
    .grid-cell { 
      width: 80px; height: 80px; background: rgba(255,255,255,0.02); border-radius: 8px; 
      display: flex; align-items: center; justify-content: center;
    }

    .tile {
      width: 100%; height: 100%; border-radius: 8px; display: flex; align-items: center; 
      justify-content: center; font-size: 1.5rem; font-weight: 800; font-family: 'Orbitron';
      transition: transform 0.1s ease-in-out;
      
      &[data-value="2"] { background: #1e1e26; color: #a0a0a0; box-shadow: inset 0 0 10px rgba(255,255,255,0.05); }
      &[data-value="4"] { background: #2a2a35; color: #d0d0d0; }
      &[data-value="8"] { background: rgba(112, 0, 255, 0.2); color: #7000ff; border: 1px solid #7000ff; box-shadow: 0 0 15px rgba(112,0,255,0.3); }
      &[data-value="16"] { background: rgba(0, 242, 255, 0.2); color: #00f2ff; border: 1px solid #00f2ff; box-shadow: 0 0 15px rgba(0,242,255,0.3); }
      &[data-value="32"] { background: rgba(255, 0, 200, 0.2); color: #ff00c8; border: 1px solid #ff00c8; box-shadow: 0 0 15px rgba(255,0,200,0.3); }
      &[data-value="64"] { background: #ff4d4d; color: #fff; }
      &[data-value="128"], &[data-value="256"], &[data-value="512"] { background: #ff9f43; color: #fff; transform: scale(1.05); }
      &[data-value="1024"], &[data-value="2048"] { 
        background: #00f2ff; color: #000; font-size: 1.2rem; 
        box-shadow: 0 0 30px #00f2ff; animation: pulse-glow 2s infinite; 
      }
    }

    .animate-pop { animation: pop 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    @keyframes pop { from { transform: scale(0); } to { transform: scale(1); } }

    .overlay {
      position: absolute; top: 0; left: 0; right: 0; bottom: 0; 
      background: rgba(0,0,0,0.8); border-radius: 16px; z-index: 10;
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem;
    }
  `]
})
export class Game2048Component implements OnInit {
    public gameService = inject(GameService);
    public fx = inject(FxService);

    board: number[][] = [];
    score = 0;
    gameOver = false;

    ngOnInit() {
        this.resetGame();
        window.addEventListener('keydown', this.handleInput.bind(this));
    }

    resetGame() {
        this.score = 0;
        this.gameOver = false;
        this.board = Array(4).fill(0).map(() => Array(4).fill(0));
        this.addTile();
        this.addTile();
    }

    addTile() {
        const empty = [];
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.board[r][c] === 0) empty.push({ r, c });
            }
        }
        if (empty.length) {
            const { r, c } = empty[Math.floor(Math.random() * empty.length)];
            this.board[r][c] = Math.random() < 0.9 ? 2 : 4;
        }
    }

    handleInput(e: KeyboardEvent) {
        if (this.gameOver) return;
        let moved = false;
        const prev = JSON.stringify(this.board);

        if (e.key === 'ArrowLeft') moved = this.moveLeft();
        if (e.key === 'ArrowRight') moved = this.moveRight();
        if (e.key === 'ArrowUp') moved = this.moveUp();
        if (e.key === 'ArrowDown') moved = this.moveDown();

        if (JSON.stringify(this.board) !== prev) {
            this.fx.playMove();
            this.addTile();
            if (this.checkGameOver()) this.gameOver = true;
        }
    }

    private moveLeft(): boolean {
        let moved = false;
        for (let r = 0; r < 4; r++) {
            let row = this.board[r].filter(v => v !== 0);
            for (let i = 0; i < row.length - 1; i++) {
                if (row[i] === row[i + 1]) {
                    row[i] *= 2;
                    this.score += row[i];
                    row.splice(i + 1, 1);
                    if (row[i] === 2048) confetti({ particleCount: 150, colors: ['#00f2ff'] });
                    this.fx.playSuccess();
                }
            }
            while (row.length < 4) row.push(0);
            this.board[r] = row;
        }
        return true;
    }

    private moveRight(): boolean { this.reverse(); const m = this.moveLeft(); this.reverse(); return m; }
    private moveUp(): boolean { this.transpose(); const m = this.moveLeft(); this.transpose(); return m; }
    private moveDown(): boolean { this.transpose(); const m = this.moveRight(); this.transpose(); return m; }

    private reverse() { this.board.forEach(r => r.reverse()); }
    private transpose() {
        for (let r = 0; r < 4; r++) {
            for (let c = r; c < 4; c++) {
                [this.board[r][c], this.board[c][r]] = [this.board[c][r], this.board[r][c]];
            }
        }
    }

    checkGameOver() {
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 4; c++) {
                if (this.board[r][c] === 0) return false;
                if (c < 3 && this.board[r][c] === this.board[r][c + 1]) return false;
                if (r < 3 && this.board[r][c] === this.board[r + 1][c]) return false;
            }
        }
        this.gameService.submitScore({ gameName: '2048', score: this.score }).subscribe();
        this.fx.playError();
        return true;
    }
}

