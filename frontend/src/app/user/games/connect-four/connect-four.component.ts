import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../../core/services/game.service';
import { FxService } from '../../../core/services/fx.service';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-connect-four',
  standalone: true,
  imports: [CommonModule],
  providers: [FxService],
  template: `
    <div class="game-view animate-fade-in">
      <div class="game-header">
        <h2 class="orbitron glow-blue">LINK FOUR</h2>
        <div class="status-pill glass neon-border">
          <span class="label">PHASE:</span>
          <span class="value" [class.p1]="currentPlayer === 1" [class.p2]="currentPlayer === 2">
            {{ winner ? 'COMPLETED' : (currentPlayer === 1 ? 'BLUE_SYNC' : 'PINK_SYNC') }}
          </span>
        </div>
      </div>

      <div class="board-container glass neon-border">
        <div class="board-grid">
          <div *ngFor="let col of board; let c = index" class="column" (click)="dropPiece(c)">
            <div class="drop-indicator" [class.active-p1]="currentPlayer === 1 && !winner" [class.active-p2]="currentPlayer === 2 && !winner"></div>
            <div *ngFor="let cell of col; let r = index" 
                 class="cell-hole" 
                 [class.win-cell]="isWinCell(c, r)">
              <div class="piece" 
                   [class.p1]="cell === 1" 
                   [class.p2]="cell === 2"
                   [class.falling]="cell !== 0">
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="controls">
        <button class="action-btn neon-border glass" (click)="resetGame()">
          <i class="bi bi-arrow-down-up"></i> FLUSH BUFFER
        </button>
      </div>
    </div>
  `,
  styles: [`
    .game-view { display: flex; flex-direction: column; align-items: center; gap: 2.5rem; }
    .status-pill { 
      padding: 0.5rem 1.5rem; border-radius: 30px; margin-top: 1rem; display: inline-flex; gap: 10px; font-size: 0.8rem;
      .label { color: #555; font-weight: 800; }
      .value { font-weight: 800; letter-spacing: 1px; }
      .p1 { color: #00f2ff; text-shadow: 0 0 10px #00f2ff; }
      .p2 { color: #ff00c8; text-shadow: 0 0 10px #ff00c8; }
    }

    .board-container { padding: 25px; border-radius: 20px; background: #08080a; }
    .board-grid { display: flex; gap: 12px; }
    
    .column { 
      display: flex; flex-direction: column-reverse; gap: 12px; cursor: pointer; position: relative;
      padding: 5px; border-radius: 8px; transition: background 0.3s;
      &:hover { background: rgba(255,255,255,0.03); .drop-indicator { opacity: 1; } }
    }

    .drop-indicator {
      position: absolute; top: -30px; left: 50%; transform: translateX(-50%);
      width: 20px; height: 20px; border-radius: 50%; opacity: 0; transition: all 0.2s;
      &.active-p1 { background: #00f2ff; box-shadow: 0 0 15px #00f2ff; }
      &.active-p2 { background: #ff00c8; box-shadow: 0 0 15px #ff00c8; }
    }

    .cell-hole {
      width: 50px; height: 50px; border-radius: 50%; background: #000;
      border: 1px solid rgba(255,255,255,0.05); position: relative; overflow: hidden;
      &.win-cell { border-color: #fff; box-shadow: 0 0 15px rgba(255,255,255,0.3); animation: pulse-glow 2s infinite; }
    }

    .piece {
      width: 100%; height: 100%; border-radius: 50%; transform: translateY(-100%); opacity: 0;
      &.p1 { background: #00f2ff; box-shadow: inset 0 0 15px rgba(0,0,0,0.5); opacity: 1; }
      &.p2 { background: #ff00c8; box-shadow: inset 0 0 15px rgba(0,0,0,0.5); opacity: 1; }
      &.falling { transform: translateY(0); transition: transform 0.4s cubic-bezier(0.47, 0, 0.745, 0.715), opacity 0.1s; border: 1px solid rgba(255,255,255,0.2); }
    }

    .action-btn { 
      padding: 1rem 2rem; border-radius: 12px; color: #fff; font-family: 'Orbitron'; font-weight: 800;
      cursor: pointer; &:hover { background: rgba(0, 242, 255, 0.1); }
    }
  `]
})
export class ConnectFourComponent {
  public gameService = inject(GameService);
  public fx = inject(FxService);

  board: number[][] = [];
  currentPlayer = 1;
  winner: number | null = null;
  winGroup: { c: number, r: number }[] = [];

  constructor() { this.resetGame(); }

  resetGame() {
    this.board = Array(7).fill(0).map(() => Array(6).fill(0));
    this.currentPlayer = 1;
    this.winner = null;
    this.winGroup = [];
  }

  dropPiece(col: number) {
    if (this.winner) return;
    const row = this.board[col].indexOf(0);
    if (row !== -1) {
      this.fx.playMove();
      this.board[col][row] = this.currentPlayer;
      const win = this.checkWin(col, row);
      if (win) {
        this.winner = this.currentPlayer;
        this.winGroup = win;
        this.handleWin();
      } else {
        this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
      }
    } else {
      this.fx.playError();
    }
  }

  isWinCell(c: number, r: number) {
    return this.winGroup.some(g => g.c === c && g.r === r);
  }

  handleWin() {
    this.fx.playSuccess();
    confetti({ particleCount: 150, spread: 70, colors: this.winner === 1 ? ['#00f2ff'] : ['#ff00c8'] });
    this.gameService.submitScore({ gameName: 'Connect Four', score: 200 }).subscribe();
  }

  checkWin(col: number, row: number) {
    const directions = [[1, 0], [0, 1], [1, 1], [1, -1]];
    const player = this.board[col][row];
    for (let [dx, dy] of directions) {
      let group = [{ c: col, r: row }];
      // Forward
      for (let i = 1; i < 4; i++) {
        let nc = col + dx * i, nr = row + dy * i;
        if (this.board[nc] && this.board[nc][nr] === player) group.push({ c: nc, r: nr }); else break;
      }
      // Backward
      for (let i = 1; i < 4; i++) {
        let nc = col - dx * i, nr = row - dy * i;
        if (this.board[nc] && this.board[nc][nr] === player) group.push({ c: nc, r: nr }); else break;
      }
      if (group.length >= 4) return group;
    }
    return null;
  }
}

