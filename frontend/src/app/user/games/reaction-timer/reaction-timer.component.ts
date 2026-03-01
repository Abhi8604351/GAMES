import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../../core/services/game.service';
import { FxService } from '../../../core/services/fx.service';
import confetti from 'canvas-confetti';

@Component({
  selector: 'app-reaction-timer',
  standalone: true,
  imports: [CommonModule],
  providers: [FxService],
  template: `
    <div class="game-view animate-fade-in">
      <div class="game-header">
        <h2 class="orbitron glow-blue">REFLEX TEST</h2>
        <p class="text-dim">Measure your neural response latency</p>
      </div>

      <div class="test-area neon-border glass" 
           [class.ready]="state === 'READY'" 
           [class.waiting]="state === 'WAIT'"
           [class.too-soon]="state === 'EARLY'"
           (mousedown)="handleClick()">
        
        <div class="main-display">
          <h1 class="orbitron" *ngIf="state === 'IDLE' || state === 'EARLY'">CLICK TO START</h1>
          <h1 class="orbitron" *ngIf="state === 'WAIT'">WAIT FOR PINK...</h1>
          <h1 class="orbitron" *ngIf="state === 'READY'">CLICK NOW!</h1>
          
          <div class="result-display" *ngIf="reactionTime > 0">
             <span class="ms glow-blue">{{ reactionTime }}</span>
             <span class="misl">ms</span>
          </div>
        </div>

        <div class="benchmark" *ngIf="reactionTime > 0">
           <span class="rank">{{ getRank() }}</span>
        </div>
      </div>

      <div class="score-pills" *ngIf="bestTime > 0">
         <div class="pill neon-border">PERSONAL BEST: <span class="glow-pink">{{bestTime}}ms</span></div>
      </div>
    </div>
  `,
  styles: [`
    .game-view { display: flex; flex-direction: column; align-items: center; gap: 2.5rem; }
    .test-area {
      width: 100%; max-width: 600px; height: 350px; border-radius: 24px;
      display: flex; flex-direction: column; align-items: center; justify-content: center;
      cursor: pointer; transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative; overflow: hidden;
      
      &.waiting { background: rgba(0, 242, 255, 0.05); border-color: #00f2ff; }
      &.ready { background: #ff00c8; border-color: #fff; h1 { color: #fff; } }
      &.too-soon { background: #ff4d4d; h1 { color: #fff; } }
    }

    .main-display {
      text-align: center;
      h1 { font-size: 2.5rem; margin: 0; letter-spacing: 4px; pointer-events: none; }
    }

    .result-display {
      margin-top: 1.5rem;
      .ms { font-size: 5rem; font-weight: 900; font-family: 'Orbitron'; }
      .misl { font-size: 1.5rem; color: #666; font-weight: 800; margin-left: 10px; }
    }

    .benchmark { margin-top: 1rem; .rank { font-family: 'Orbitron'; font-weight: 800; color: #ff00c8; letter-spacing: 2px; } }
    .score-pills { .pill { padding: 0.8rem 2rem; border-radius: 40px; font-weight: 800; } }
  `]
})
export class ReactionTimerComponent {
  public gameService = inject(GameService);
  public fx = inject(FxService);

  state: 'IDLE' | 'WAIT' | 'READY' | 'EARLY' = 'IDLE';
  reactionTime = 0;
  bestTime = 0;
  startTime = 0;
  timer: any;

  handleClick() {
    if (this.state === 'IDLE' || this.state === 'EARLY') {
      this.startWaiting();
    } else if (this.state === 'WAIT') {
      this.handleEarly();
    } else if (this.state === 'READY') {
      this.handleSuccess();
    }
  }

  startWaiting() {
    this.fx.playSelect();
    this.state = 'WAIT';
    this.reactionTime = 0;
    const delay = 2000 + Math.random() * 4000;
    this.timer = setTimeout(() => {
      this.state = 'READY';
      this.startTime = Date.now();
    }, delay);
  }

  handleEarly() {
    clearTimeout(this.timer);
    this.state = 'EARLY';
    this.fx.playError();
  }

  handleSuccess() {
    this.reactionTime = Date.now() - this.startTime;
    this.state = 'IDLE';
    this.fx.playSuccess();

    if (this.bestTime === 0 || this.reactionTime < this.bestTime) {
      this.bestTime = this.reactionTime;
      confetti({ particleCount: 100, colors: ['#00f2ff'] });
    }

    this.gameService.submitScore({ gameName: 'Reaction Timer', score: this.reactionTime }).subscribe();
  }

  getRank() {
    if (this.reactionTime < 200) return 'ELITE REFLEXES';
    if (this.reactionTime < 250) return 'COMBAT READY';
    if (this.reactionTime < 300) return 'AVERAGE HUMAN';
    return 'LATENCY DETECTED';
  }
}

