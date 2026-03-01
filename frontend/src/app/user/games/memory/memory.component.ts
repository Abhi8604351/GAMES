import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameService } from '../../../core/services/game.service';
import { FxService } from '../../../core/services/fx.service';
import confetti from 'canvas-confetti';

interface Card {
  id: number;
  icon: string;
  flipped: boolean;
  matched: boolean;
}

@Component({
  selector: 'app-memory',
  standalone: true,
  imports: [CommonModule],
  providers: [FxService],
  template: `
    <div class="game-view animate-fade-in">
      <div class="game-header">
        <h2 class="orbitron glow-blue">NEURAL LINK</h2>
        <div class="stat-pills">
          <div class="pill neon-border glass">SYNC_OPS: <span class="glow-blue">{{moves}}</span></div>
          <div class="pill neon-border glass">MATCHES: <span class="glow-pink">{{matches}}/8</span></div>
        </div>
      </div>

      <div class="arena-grid">
        <div *ngFor="let card of cards" 
             class="card-wrapper" 
             (click)="flipCard(card)">
          <div class="card-inner" [class.is-flipped]="card.flipped || card.matched">
            <div class="card-front glass neon-border">
              <div class="pattern"></div>
              <i class="bi bi-cpu"></i>
            </div>
            <div class="card-back neon-border" [class.is-matched]="card.matched">
              <i [class]="'bi ' + card.icon"></i>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-actions">
        <button class="action-btn neon-border glass" (click)="resetGame()">
           <i class="bi bi-terminal"></i> REINITIALIZE DECKS
        </button>
      </div>
    </div>
  `,
  styles: [`
    .game-view { display: flex; flex-direction: column; align-items: center; gap: 2.5rem; }
    .stat-pills { display: flex; gap: 1rem; margin-top: 1rem; }
    .pill { padding: 0.6rem 1.5rem; border-radius: 12px; font-family: 'Orbitron'; font-size: 0.7rem; }
    
    .arena-grid {
      display: grid;
      grid-template-columns: repeat(4, 100px);
      gap: 15px;
      padding: 1rem;
    }

    .card-wrapper { 
      width: 100px; height: 140px; perspective: 1000px; cursor: pointer;
      &:hover .card-front { border-color: #00f2ff; background: rgba(0, 242, 255, 0.05); }
    }

    .card-inner {
      position: relative; width: 100%; height: 100%; text-align: center;
      transition: transform 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      transform-style: preserve-3d;
      &.is-flipped { transform: rotateY(180deg); }
    }

    .card-front, .card-back {
      position: absolute; width: 100%; height: 100%; backface-visibility: hidden;
      border-radius: 12px; display: flex; align-items: center; justify-content: center;
      font-size: 2.5rem;
    }

    .card-front {
      background: rgba(20, 20, 25, 0.8); color: #333;
      .pattern { 
        position: absolute; top:0; left:0; right:0; bottom:0; padding:10px;
        border: 1px solid rgba(255,255,255,0.02); opacity: 0.1;
      }
    }

    .card-back {
      background: #0d0d12; color: #00f2ff; transform: rotateY(180deg);
      box-shadow: inset 0 0 20px rgba(0, 242, 255, 0.1);
      &.is-matched { border-color: #ff00c8; color: #ff00c8; box-shadow: 0 0 15px rgba(255, 0, 200, 0.2); }
    }

    .action-btn {
      padding: 1rem 2rem; border-radius: 12px; color: #fff; font-family: 'Orbitron';
      font-size: 0.8rem; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 10px;
      &:hover { background: rgba(0, 242, 255, 0.1); color: #00f2ff; }
    }
  `]
})
export class MemoryComponent implements OnInit {
  public gameService = inject(GameService);
  public fx = inject(FxService);

  icons = ['bi-heart-fill', 'bi-star-fill', 'bi-moon-fill', 'bi-sun-fill', 'bi-lightning-fill', 'bi-gem', 'bi-controller', 'bi-rocket-takeoff-fill'];
  cards: Card[] = [];
  flippedCards: Card[] = [];
  moves = 0;
  matches = 0;

  ngOnInit() { this.resetGame(); }

  resetGame() {
    this.fx.playSelect();
    this.moves = 0;
    this.matches = 0;
    this.flippedCards = [];
    const deck = [...this.icons, ...this.icons].map((icon, index) => ({
      id: index,
      icon,
      flipped: false,
      matched: false
    }));
    this.cards = deck.sort(() => Math.random() - 0.5);
  }

  flipCard(card: Card) {
    if (card.flipped || card.matched || this.flippedCards.length === 2) return;

    this.fx.playMove();
    card.flipped = true;
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.moves++;
      this.checkMatch();
    }
  }

  checkMatch() {
    const [c1, c2] = this.flippedCards;
    if (c1.icon === c2.icon) {
      setTimeout(() => {
        c1.matched = true;
        c2.matched = true;
        this.matches++;
        this.flippedCards = [];
        this.fx.playSuccess();
        if (this.matches === this.icons.length) {
          confetti({ particleCount: 200, spread: 100, colors: ['#00f2ff', '#ff00c8'] });
          this.gameService.submitScore({ gameName: 'Memory', score: Math.max(0, 200 - this.moves * 5) }).subscribe();
        }
      }, 500);
    } else {
      setTimeout(() => {
        c1.flipped = false;
        c2.flipped = false;
        this.flippedCards = [];
      }, 1000);
    }
  }
}

