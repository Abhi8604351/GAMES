import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { GameService } from '../../../core/services/game.service';
import { FxService } from '../../../core/services/fx.service';

@Component({
  selector: 'app-rps',
  standalone: true,
  imports: [CommonModule],
  providers: [FxService],
  template: `
    <div class="game-view animate-fade-in">
      <div class="battle-header">
        <h2 class="orbitron glow-blue">COMBAT RPS</h2>
      </div>

      <div class="arena glass neon-border">
        <div class="combatant user" [@shake]="shakeUser">
          <div class="avatar blue neon-border"><i class="bi bi-person-fill"></i></div>
          <div class="stats">
            <span class="label">PLAYER</span>
            <div class="hp-bar blue">
              <div class="hp-fill" [style.width.%]="userHP"></div>
            </div>
            <span class="score-val">{{userScore}}</span>
          </div>
          <div class="choice-reveal" *ngIf="userChoice" [@reveal]>
             <i [class]="getIcon(userChoice)"></i>
          </div>
        </div>

        <div class="vs-badge orbitron">VS</div>

        <div class="combatant cpu" [@shake]="shakeCPU">
          <div class="avatar pink neon-border"><i class="bi bi-robot"></i></div>
          <div class="stats">
            <span class="label">MAINFRAME</span>
            <div class="hp-bar pink">
              <div class="hp-fill" [style.width.%]="cpuHP"></div>
            </div>
            <span class="score-val">{{cpuScore}}</span>
          </div>
          <div class="choice-reveal" *ngIf="cpuChoice" [@reveal]>
             <i [class]="getIcon(cpuChoice)"></i>
          </div>
        </div>
      </div>

      <div class="battle-log glass" *ngIf="result">
        <span [class.winner]="result.includes('Win')" [class.loser]="result.includes('CPU')">
          {{ result }}
        </span>
      </div>

      <div class="weapon-selector">
        <button *ngFor="let choice of weapons" 
                (click)="play(choice)" 
                class="weapon-btn neon-border glass"
                (mouseenter)="fx.playSelect()">
          <i [class]="getIcon(choice)"></i>
          <span>{{choice | uppercase}}</span>
        </button>
      </div>
      
      <button class="reboot-btn text-dim" (click)="resetGame()">REBOOT ARENA</button>
    </div>
  `,
  styles: [`
    .game-view { display: flex; flex-direction: column; align-items: center; gap: 2rem; max-width: 900px; margin: 0 auto; }
    .arena { 
      width: 100%; height: 350px; border-radius: 24px; padding: 2rem; display: flex; 
      justify-content: space-between; align-items: center; position: relative; gap: 2rem;
    }
    .combatant { 
      flex: 1; display: flex; flex-direction: column; align-items: center; gap: 1.5rem; 
      position: relative;
    }
    .avatar { 
      width: 80px; height: 80px; border-radius: 50%; display: flex; align-items: center; 
      justify-content: center; font-size: 2.5rem; background: rgba(0,0,0,0.3);
      &.blue { color: #00f2ff; border-color: #00f2ff; }
      &.pink { color: #ff00c8; border-color: #ff00c8; }
    }
    .hp-bar { 
      width: 150px; height: 8px; background: #222; border-radius: 4px; overflow: hidden; margin: 8px 0;
      .hp-fill { height: 100%; transition: width 0.5s ease; }
      &.blue .hp-fill { background: #00f2ff; box-shadow: 0 0 10px #00f2ff; }
      &.pink .hp-fill { background: #ff00c8; box-shadow: 0 0 10px #ff00c8; }
    }
    .score-val { font-family: 'Orbitron'; font-size: 1.5rem; font-weight: 800; }
    .vs-badge { font-size: 2rem; color: #444; font-weight: 900; }
    .choice-reveal { 
      position: absolute; top: -50px; font-size: 3rem; color: #fff; text-shadow: 0 0 15px rgba(255,255,255,0.5); 
    }

    .weapon-selector { display: flex; gap: 1.5rem; }
    .weapon-btn { 
      padding: 1.5rem; border-radius: 16px; width: 120px; color: #fff; cursor: pointer;
      display: flex; flex-direction: column; align-items: center; gap: 10px; transition: all 0.3s;
      i { font-size: 2rem; color: #00f2ff; }
      span { font-family: 'Orbitron'; font-size: 0.7rem; font-weight: 800; }
      &:hover { transform: translateY(-10px); background: rgba(0,242,255,0.1); border-color: #00f2ff; }
    }

    .battle-log { padding: 1rem 3rem; border-radius: 40px; font-family: 'Orbitron'; font-weight: 800; letter-spacing: 1px; }
    .winner { color: #00f2ff; text-shadow: 0 0 10px #00f2ff; }
    .loser { color: #ff00c8; text-shadow: 0 0 10px #ff00c8; }
    .reboot-btn { background: none; border: none; cursor: pointer; font-family: 'Orbitron'; font-size: 0.7rem; letter-spacing: 2px; }
  `],
  animations: [
    trigger('shake', [
      transition('false => true', [
        animate('0.1s', style({ transform: 'translateX(-10px)' })),
        animate('0.1s', style({ transform: 'translateX(10px)' })),
        animate('0.1s', style({ transform: 'translateX(-10px)' })),
        animate('0.1s', style({ transform: 'translateX(0)' }))
      ])
    ]),
    trigger('reveal', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.5)' }),
        animate('0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)', style({ opacity: 1, transform: 'scale(1)' }))
      ])
    ])
  ]
})
export class RPSComponent {
  public gameService = inject(GameService);
  public fx = inject(FxService);

  userScore = 0;
  cpuScore = 0;
  userChoice = '';
  cpuChoice = '';
  result = '';
  userHP = 100;
  cpuHP = 100;

  shakeUser = false;
  shakeCPU = false;
  weapons = ['rock', 'paper', 'scissors'];

  play(choice: string) {
    this.fx.playMove();
    this.userChoice = choice;
    this.cpuChoice = this.weapons[Math.floor(Math.random() * 3)];

    if (this.userChoice === this.cpuChoice) {
      this.result = "SIMULATION TIE";
    } else if (
      (this.userChoice === 'rock' && this.cpuChoice === 'scissors') ||
      (this.userChoice === 'paper' && this.cpuChoice === 'rock') ||
      (this.userChoice === 'scissors' && this.cpuChoice === 'paper')
    ) {
      this.result = "MISSION WIN";
      this.userScore++;
      this.cpuHP = Math.max(0, this.cpuHP - 20);
      this.shakeCPU = true;
      setTimeout(() => this.shakeCPU = false, 500);
      this.fx.playSuccess();
      this.gameService.submitScore({ gameName: 'RPS', score: this.userScore }).subscribe();
    } else {
      this.result = "MAINFRAME WIN";
      this.cpuScore++;
      this.userHP = Math.max(0, this.userHP - 20);
      this.shakeUser = true;
      setTimeout(() => this.shakeUser = false, 500);
      this.fx.playError();
    }
  }

  getIcon(choice: string) {
    if (choice === 'rock') return 'bi-gem';
    if (choice === 'paper') return 'bi-file-earmark-fill';
    return 'bi-scissors';
  }

  resetGame() {
    this.fx.playSelect();
    this.userScore = 0;
    this.cpuScore = 0;
    this.userChoice = '';
    this.cpuChoice = '';
    this.result = '';
    this.userHP = 100;
    this.cpuHP = 100;
  }
}

