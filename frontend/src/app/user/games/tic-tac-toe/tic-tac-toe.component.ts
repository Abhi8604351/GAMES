import { Component, inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../../core/services/game.service';
import { FxService } from '../../../core/services/fx.service';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-tic-tac-toe',
  standalone: true,
  imports: [CommonModule],
  providers: [FxService],
  template: `
    <div class="game-view animate-fade-in">
      <div class="game-header">
        <h2 class="glow-blue orbitron">TIC TAC TOE</h2>
        <div class="score-pill glass neon-border">
          <span class="label">STATUS:</span>
          <span class="value" [class.winner-text]="winner">{{ statusMessage }}</span>
        </div>
      </div>

      <div class="board-frame neon-border glass">
        <div class="board-grid">
          <div *ngFor="let cell of board; let i = index" 
               class="cell-wrapper" 
               (click)="makeMove(i)">
            <div class="cell-content" [class.filled]="cell !== ''" [class.winner-cell]="isWinnerCell(i)">
              <span *ngIf="cell === 'X'" class="x-mark glow-blue">X</span>
              <span *ngIf="cell === 'O'" class="o-mark glow-pink">O</span>
              <div class="cell-bg"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="controls">
        <button class="action-btn neon-border" (click)="resetGame()">
          <i class="bi bi-arrow-clockwise"></i> REBOOT SYSTEM
        </button>
      </div>
    </div>
  `,
  styles: [`
    .game-view { display: flex; flex-direction: column; align-items: center; gap: 2.5rem; }
    .game-header { text-align: center; }
    .score-pill { 
      padding: 0.5rem 1.5rem; border-radius: 30px; margin-top: 1rem; display: inline-flex; gap: 10px; font-size: 0.9rem;
      .label { color: #666; font-weight: 800; }
      .value { color: #fff; font-weight: 800; letter-spacing: 1px; }
      .winner-text { color: #00f2ff; text-shadow: 0 0 10px #00f2ff; }
    }

    .board-frame { padding: 20px; border-radius: 20px; box-shadow: 0 0 40px rgba(0,0,0,0.5); }
    .board-grid {
      display: grid; grid-template-columns: repeat(3, 110px); grid-template-rows: repeat(3, 110px); gap: 15px;
    }

    .cell-wrapper { perspective: 1000px; cursor: pointer; }
    .cell-content {
      width: 100%; height: 100%; background: rgba(255,255,255,0.03); border-radius: 12px;
      display: flex; align-items: center; justify-content: center; font-family: 'Orbitron', sans-serif;
      font-size: 3rem; font-weight: 900; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      position: relative; overflow: hidden; border: 1px solid rgba(255,255,255,0.05);

      &:hover:not(.filled) {
        background: rgba(0, 242, 255, 0.05); border-color: rgba(0, 242, 255, 0.3);
        transform: translateZ(10px);
      }
      
      &.filled { transform: translateZ(5px); }
      &.winner-cell { 
        background: rgba(0, 242, 255, 0.1); border-color: #00f2ff;
        animation: pulse-glow 2s infinite;
      }
    }

    .cell-bg { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background: radial-gradient(circle at center, rgba(255,255,255,0.05), transparent); z-index: 0; }
    .x-mark, .o-mark { z-index: 1; }

    .action-btn {
      background: rgba(255,255,255,0.02); border-radius: 12px; padding: 1rem 2rem; color: #fff;
      font-weight: 800; font-family: 'Orbitron'; cursor: pointer; display: flex; align-items: center; gap: 10px;
      &:hover { background: rgba(0, 242, 255, 0.1); }
    }
  `]
})
export class TicTacToeComponent {
  public gameService = inject(GameService);
  public fx = inject(FxService);

  board: string[] = Array(9).fill('');
  currentPlayer: 'X' | 'O' = 'X';
  winner: string | null = null;
  winnerLines: number[] = [];
  isDraw = false;

  get statusMessage(): string {
    if (this.winner) return `PLAYER ${this.winner} DOMINATED`;
    if (this.isDraw) return 'SYSTEM DRAW';
    return `PLAYER ${this.currentPlayer} TURN`;
  }

  makeMove(index: number) {
    if (this.board[index] || this.winner) return;

    this.fx.playMove();
    this.board[index] = this.currentPlayer;

    const winData = this.checkWinner();
    if (winData) {
      this.winner = this.currentPlayer;
      this.winnerLines = winData;
      this.handleWin();
    } else if (this.board.every(cell => cell !== '')) {
      this.isDraw = true;
      this.fx.playError();
    } else {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }
  }

  checkWinner(): number[] | null {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    for (const line of lines) {
      const [a, b, c] = line;
      if (this.board[a] && this.board[a] === this.board[b] && this.board[a] === this.board[c]) {
        return line;
      }
    }
    return null;
  }

  isWinnerCell(index: number): boolean {
    return this.winnerLines.includes(index);
  }

  handleWin() {
    this.fx.playSuccess();
    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#00f2ff', '#7000ff', '#ff00c8']
    });
    this.gameService.submitScore({ gameName: 'Tic Tac Toe', score: 100 }).subscribe();
  }

  resetGame() {
    this.fx.playSelect();
    this.board = Array(9).fill('');
    this.currentPlayer = 'X';
    this.winner = null;
    this.winnerLines = [];
    this.isDraw = false;
  }
}

