import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../../core/services/game.service';
import { FxService } from '../../../core/services/fx.service';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-hangman',
  standalone: true,
  imports: [CommonModule],
  providers: [FxService],
  template: `
    <div class="game-view animate-fade-in">
      <div class="game-header">
        <h2 class="orbitron glow-blue">DATA BREACH</h2>
        <div class="status-pills">
          <div class="pill neon-border glass">THREAT_LEVEL: <span [class.glow-pink]="mistakes > 3">{{mistakes}} / {{maxMistakes}}</span></div>
        </div>
      </div>

      <div class="breach-area glass neon-border">
        <!-- Hangman Visualization (Procedural SVG/CSS) -->
        <div class="hangman-viz">
           <svg width="200" height="250" viewBox="0 0 200 250">
             <path d="M20 230 L180 230 M50 230 L50 20 M50 20 L150 20 L150 50" stroke="#333" stroke-width="4" fill="none"/>
             <circle *ngIf="mistakes > 0" cx="150" cy="70" r="20" stroke="#ff00c8" stroke-width="3" fill="none" class="animate-flicker"/>
             <line *ngIf="mistakes > 1" x1="150" y1="90" x2="150" y2="160" stroke="#ff00c8" stroke-width="3"/>
             <line *ngIf="mistakes > 2" x1="150" y1="110" x2="120" y2="140" stroke="#ff00c8" stroke-width="3"/>
             <line *ngIf="mistakes > 3" x1="150" y1="110" x2="180" y2="140" stroke="#ff00c8" stroke-width="3"/>
             <line *ngIf="mistakes > 4" x1="150" y1="160" x2="120" y2="200" stroke="#ff00c8" stroke-width="3"/>
             <line *ngIf="mistakes > 5" x1="150" y1="160" x2="180" y2="200" stroke="#ff00c8" stroke-width="3"/>
           </svg>
        </div>

        <div class="word-display">
          <div *ngFor="let char of displayWord" class="char-box" [class.revealed]="char !== '_'">
            <span class="char">{{char}}</span>
            <div class="underline"></div>
          </div>
        </div>
      </div>

      <div class="input-panel">
        <div class="keyboard">
          <button *ngFor="let letter of alphabet" 
                  (click)="guess(letter)" 
                  [disabled]="guessedLetters.has(letter) || gameOver"
                  class="key glass neon-border"
                  [class.used]="guessedLetters.has(letter)"
                  [class.correct]="isCorrect(letter)"
                  [class.wrong]="isWrong(letter)">
            {{letter}}
          </button>
        </div>
      </div>

      <div class="terminal-footer glass" *ngIf="gameOver">
        <div class="result" [class.success]="winner" [class.fail]="!winner">
          {{ winner ? 'BREACH SUCCESSFUL // DATA EXTRACTED' : 'BREACH FAILED // ENCRYPTION LOCKED' }}
        </div>
        <div class="word-reveal" *ngIf="!winner">TARGET_WORD: {{targetWord}}</div>
        <button class="action-btn neon-border" (click)="resetGame()">RUN_NEW_BREACH</button>
      </div>
    </div>
  `,
  styles: [`
    .game-view { display: flex; flex-direction: column; align-items: center; gap: 2.5rem; }
    .status-pills { display: flex; gap: 1rem; margin-top: 1rem; }
    .pill { padding: 0.6rem 1.5rem; border-radius: 12px; font-family: 'Orbitron'; font-size: 0.7rem; }
    
    .breach-area { 
      padding: 2rem; border-radius: 24px; min-width: 500px; 
      display: flex; flex-direction: column; align-items: center; gap: 2rem;
    }

    .word-display { display: flex; gap: 12px; }
    .char-box {
      width: 45px; height: 55px; display: flex; align-items: center; justify-content: center; position: relative;
      .char { font-family: 'Orbitron'; font-size: 2rem; font-weight: 800; color: #fff; }
      .underline { position: absolute; bottom: 0; width: 100%; height: 3px; background: #333; transition: all 0.3s; }
      &.revealed .underline { background: #00f2ff; box-shadow: 0 0 10px #00f2ff; }
    }

    .keyboard {
      display: grid; grid-template-columns: repeat(9, 45px); gap: 10px;
    }
    .key {
      width: 45px; height: 45px; border-radius: 6px; color: #666; font-family: 'Orbitron';
      font-weight: 800; cursor: pointer; transition: all 0.2s;
      &.used { opacity: 0.4; }
      &.correct { color: #00f2ff; border-color: #00f2ff; background: rgba(0, 242, 255, 0.1); opacity: 1; }
      &.wrong { color: #ff00c8; border-color: #ff00c8; background: rgba(255, 0, 200, 0.1); opacity: 1; }
      &:hover:not(:disabled) { border-color: #00f2ff; color: #fff; }
    }

    .terminal-footer {
      padding: 1.5rem 3rem; border-radius: 20px; text-align: center; display: flex; flex-direction: column; gap: 1rem;
      .result { font-family: 'Orbitron'; font-size: 1.2rem; font-weight: 900; letter-spacing: 2px; }
      .success { color: #00f2ff; }
      .fail { color: #ff00c8; }
      .word-reveal { font-size: 0.8rem; color: #666; }
    }

    .action-btn { 
      background: none; padding: 0.8rem 2rem; border-radius: 12px; color: #fff;
      font-family: 'Orbitron'; font-weight: 800; cursor: pointer;
      &:hover { background: rgba(0, 242, 255, 0.1); }
    }

    .animate-flicker { animation: flicker 1s infinite alternate; }
    @keyframes flicker { 0% { opacity: 0.5; } 100% { opacity: 1; } }
  `]
})
export class HangmanComponent {
  public gameService = inject(GameService);
  public fx = inject(FxService);

  words = ['ANGULAR', 'NODEJS', 'EXPRESS', 'MONGODB', 'JAVASCRIPT', 'TYPESCRIPT', 'RENDER', 'VERCEL', 'FIREWALL', 'MAINBOARD'];
  alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  targetWord = '';
  displayWord: string[] = [];
  guessedLetters = new Set<string>();
  mistakes = 0;
  maxMistakes = 6;
  gameOver = false;
  winner = false;

  constructor() { this.resetGame(); }

  resetGame() {
    this.targetWord = this.words[Math.floor(Math.random() * this.words.length)];
    this.displayWord = Array(this.targetWord.length).fill('_');
    this.guessedLetters.clear();
    this.mistakes = 0;
    this.gameOver = false;
    this.winner = false;
  }

  guess(letter: string) {
    if (this.gameOver) return;
    this.guessedLetters.add(letter);

    if (this.targetWord.includes(letter)) {
      this.fx.playMove();
      for (let i = 0; i < this.targetWord.length; i++) {
        if (this.targetWord[i] === letter) this.displayWord[i] = letter;
      }
      if (!this.displayWord.includes('_')) {
        this.winner = true;
        this.gameOver = true;
        this.fx.playSuccess();
        confetti({ particleCount: 150, colors: ['#00f2ff'] });
        this.gameService.submitScore({ gameName: 'Hangman', score: 100 - this.mistakes * 10 }).subscribe();
      }
    } else {
      this.mistakes++;
      this.fx.playError();
      if (this.mistakes >= this.maxMistakes) {
        this.gameOver = true;
        this.gameService.submitScore({ gameName: 'Hangman', score: 0 }).subscribe();
      }
    }
  }

  isCorrect(letter: string) { return this.guessedLetters.has(letter) && this.targetWord.includes(letter); }
  isWrong(letter: string) { return this.guessedLetters.has(letter) && !this.targetWord.includes(letter); }
}

