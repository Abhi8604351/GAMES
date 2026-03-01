import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameService } from '../../../core/services/game.service';
import { FxService } from '../../../core/services/fx.service';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-number-guess',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [FxService],
  template: `
    <div class="game-view animate-fade-in">
      <div class="game-header">
        <h2 class="orbitron glow-blue">CIPHER HINT</h2>
        <div class="pill neon-border glass">ATTEMPTS: <span class="glow-pink">{{attempts}}</span></div>
      </div>

      <div class="cipher-box glass neon-border">
        <div class="binary-stream">
          <marquee scrollamount="10">{{binaryStream}}</marquee>
        </div>
        
        <div class="main-interface">
          <p class="instruction orbitron">RECONSTRUCT TARGET_INT [1-100]</p>
          
          <div class="display-box">
             <div class="feedback-text" [class.success]="gameOver" [class.hint]="!gameOver">
                {{message}}
             </div>
          </div>

          <div class="input-row">
            <input type="number" 
                   [(ngModel)]="userGuess" 
                   [disabled]="gameOver" 
                   placeholder="CODE" 
                   class="cipher-input neon-border"
                   (keyup.enter)="checkGuess()">
            <button (click)="checkGuess()" 
                    [disabled]="gameOver" 
                    class="decode-btn neon-border">
              <i class="bi bi-search"></i> DECODE
            </button>
          </div>
        </div>

        <div *ngIf="gameOver" class="result-actions">
           <button class="action-btn neon-border" (click)="resetGame()">RUN_NEW_CYCLES</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .game-view { display: flex; flex-direction: column; align-items: center; gap: 2.5rem; }
    .pill { padding: 0.6rem 1.5rem; border-radius: 12px; font-family: 'Orbitron'; font-size: 0.8rem; margin-top: 1rem; }
    
    .cipher-box { 
      padding: 2.5rem; border-radius: 24px; min-width: 450px; background: #08080a;
      display: flex; flex-direction: column; gap: 1.5rem; position: relative; overflow: hidden;
    }

    .binary-stream { 
      position: absolute; top:0; left:0; right:0; font-family: monospace; font-size: 0.6rem; 
      color: rgba(0, 242, 255, 0.05); pointer-events: none; 
    }

    .instruction { font-size: 0.75rem; color: #444; letter-spacing: 2px; text-align: center; }

    .display-box {
      height: 80px; display: flex; align-items: center; justify-content: center;
      background: rgba(0,0,0,0.3); border-radius: 12px; border: 1px solid rgba(255,255,255,0.02);
    }
    .feedback-text { 
      font-family: 'Orbitron'; font-weight: 800; font-size: 1.2rem; text-align: center;
      &.success { color: #00ff88; text-shadow: 0 0 10px #00ff88; }
      &.hint { color: #00f2ff; }
    }

    .input-row { display: flex; gap: 1rem; margin-top: 1.5rem; }
    .cipher-input {
      flex: 1; background: #0c0c10; padding: 1rem; border-radius: 12px; border-color: #222;
      color: #fff; font-family: 'Orbitron'; font-size: 1.2rem; outline: none; text-align: center;
      &:focus { border-color: #00f2ff; box-shadow: 0 0 15px rgba(0, 242, 255, 0.1); }
    }
    .decode-btn {
      padding: 0 1.5rem; border-radius: 12px; background: rgba(0, 242, 255, 0.05); color: #00f2ff;
      font-family: 'Orbitron'; font-weight: 800; cursor: pointer;
      &:hover { background: #00f2ff; color: #000; }
    }

    .result-actions { text-align: center; margin-top: 1rem; }
    .action-btn { 
      background: none; padding: 0.8rem 2rem; border-radius: 12px; color: #fff;
      font-family: 'Orbitron'; font-weight: 800; cursor: pointer;
      &:hover { background: rgba(0, 242, 255, 0.1); color: #00f2ff; }
    }
  `]
})
export class NumberGuessComponent {
  public gameService = inject(GameService);
  public fx = inject(FxService);

  targetNumber = 0;
  userGuess: number | null = null;
  attempts = 0;
  message = 'WAITING FOR INPUT...';
  gameOver = false;
  binaryStream = '';

  constructor() {
    this.resetGame();
    this.binaryStream = Array(100).fill(0).map(() => Math.round(Math.random())).join('');
  }

  resetGame() {
    this.fx.playSelect();
    this.targetNumber = Math.floor(Math.random() * 100) + 1;
    this.attempts = 0;
    this.message = 'WAITING FOR INPUT...';
    this.userGuess = null;
    this.gameOver = false;
  }

  checkGuess() {
    if (this.userGuess === null) return;
    this.attempts++;

    if (this.userGuess === this.targetNumber) {
      this.message = `MATCH FOUND: [${this.targetNumber}]`;
      this.gameOver = true;
      this.fx.playSuccess();
      confetti({ particleCount: 150, colors: ['#00f2ff', '#ff00c8'] });
      this.gameService.submitScore({ gameName: 'Number Guess', score: Math.max(0, 1000 - this.attempts * 50) }).subscribe();
    } else {
      this.fx.playMove();
      this.message = this.userGuess < this.targetNumber ? 'ERROR: VALUE_TOO_LOW' : 'ERROR: VALUE_TOO_HIGH';
      setTimeout(() => { if (!this.gameOver) this.message = 'RETRY_INPUT...' }, 1000);
    }
    this.userGuess = null;
  }
}

