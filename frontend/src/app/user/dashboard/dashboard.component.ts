import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { GameService, Score } from '../../core/services/game.service';
import { AuthService } from '../../core/services/auth.service';
import { FxService } from '../../core/services/fx.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [FxService],
  template: `
    <div class="dashboard animate-fade-in">
      <div class="welcome-header glass neon-border">
        <div class="header-content">
          <h2 class="glow-blue">COMMAND CENTER</h2>
          <p class="text-dim">Agent: <span class="glow-purple">{{authService.currentUser()?.name}}</span> | Status: <span class="online">ONLINE</span></p>
        </div>
        <div class="header-stats">
          <div class="lite-stat">
            <span class="label">LEVEL</span>
            <span class="value">14</span>
          </div>
          <div class="lite-stat">
            <span class="label">EXP</span>
            <span class="value">8,420</span>
          </div>
        </div>
      </div>

      <div class="stats-grid" [@listAnimation]="myScores.length">
        <div class="neon-card stat-card active-card">
          <div class="stat-icon blue"><i class="bi bi-controller"></i></div>
          <div class="stat-info">
            <span class="label">SESSIONS</span>
            <span class="value">{{myScores.length}}</span>
          </div>
        </div>
        <div class="neon-card stat-card">
          <div class="stat-icon purple"><i class="bi bi-trophy"></i></div>
          <div class="stat-info">
            <span class="label">HIGH SCORE</span>
            <span class="value">{{topScore}}</span>
          </div>
        </div>
        <div class="neon-card stat-card">
          <div class="stat-icon pink"><i class="bi bi-lightning-charge"></i></div>
          <div class="stat-info">
            <span class="label">RECENT OPS</span>
            <span class="value">{{latestGame}}</span>
          </div>
        </div>
      </div>

      <div class="gallery-section">
        <div class="section-header">
          <h3 class="orbitron glow-blue">GAME ROSTER</h3>
          <div class="line"></div>
        </div>
        <div class="arcade-grid" [@listAnimation]="games.length">
          <div *ngFor="let game of games" 
               class="game-card neon-border animate-float" 
               [routerLink]="['/user/games', game.id]"
               (mouseenter)="fx.playSelect()">
            <div class="card-img">
              <i [class]="'bi ' + game.icon"></i>
            </div>
            <div class="card-info glass">
              <h4>{{game.name}}</h4>
              <div class="card-footer">
                <span class="category">ARCADE</span>
                <span class="action">LAUNCH <i class="bi bi-play-fill"></i></span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="activity-section glass neon-border">
        <h3 class="orbitron">MISSION LOGS</h3>
        <div class="table-wrapper">
          <table *ngIf="myScores.length > 0; else noScores">
            <thead>
              <tr>
                <th>OPERATION</th>
                <th>RESULT</th>
                <th>TIMESTAMP</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let s of myScores.slice(0, 5)">
                <td class="op-name">{{s.gameName}}</td>
                <td class="glow-blue">{{s.score}}</td>
                <td class="text-dim">{{s.playedAt | date:'HH:mm | MMM d'}}</td>
              </tr>
            </tbody>
          </table>
          <ng-template #noScores>
            <div class="empty-log">NO DATA DETECTED IN LOGS. INITIATE SESSIONS.</div>
          </ng-template>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { display: flex; flex-direction: column; gap: 2.5rem; max-width: 1400px; margin: 0 auto; }
    
    .welcome-header {
      padding: 2rem;
      border-radius: 20px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      h2 { margin: 0; font-size: 2.2rem; font-weight: 900; }
      .online { color: #00ff88; font-weight: bold; font-size: 0.8rem; margin-left: 5px; }
    }

    .lite-stat {
      text-align: right;
      .label { display: block; font-size: 0.7rem; color: #666; font-weight: 800; }
      .value { font-size: 1.4rem; color: #00f2ff; font-weight: 800; }
    }

    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
      gap: 1.5rem;
    }

    .stat-card {
      display: flex;
      align-items: center;
      gap: 1.5rem;
      padding: 1.5rem;
      background: rgba(20, 20, 25, 0.4);
      
      .stat-icon {
        width: 60px; height: 60px; border-radius: 12px;
        display: flex; align-items: center; justify-content: center; font-size: 1.8rem;
        &.blue { background: rgba(0, 242, 255, 0.05); color: #00f2ff; border: 1px solid rgba(0, 242, 255, 0.2); }
        &.purple { background: rgba(112, 0, 255, 0.05); color: #7000ff; border: 1px solid rgba(112, 0, 255, 0.2); }
        &.pink { background: rgba(255, 0, 200, 0.05); color: #ff00c8; border: 1px solid rgba(255, 0, 200, 0.2); }
      }
      
      .label { font-size: 0.75rem; color: #666; letter-spacing: 2px; font-weight: 700; }
      .value { font-size: 1.8rem; font-weight: 800; color: #fff; }
    }

    .section-header {
      display: flex; align-items: center; gap: 1.5rem; margin-bottom: 2rem;
      h3 { margin: 0; white-space: nowrap; }
      .line { flex: 1; height: 1px; background: linear-gradient(90deg, rgba(0, 242, 255, 0.3), transparent); }
    }

    .game-card {
      height: 320px;
      .card-info {
        padding: 1.2rem;
        position: absolute; bottom: 0; left: 0; right: 0;
        h4 { margin: 0 0 0.8rem 0; font-size: 1.1rem; }
      }
      .card-footer {
        display: flex; justify-content: space-between; align-items: center;
        .category { font-size: 0.7rem; color: #666; font-weight: 800; border: 1px solid #333; padding: 2px 8px; border-radius: 4px; }
        .action { font-size: 0.8rem; color: #00f2ff; font-weight: 700; }
      }
    }

    .activity-section {
      padding: 2rem; border-radius: 20px;
      table {
        width: 100%; border-collapse: separate; border-spacing: 0 10px;
        th { text-align: left; padding: 0.5rem 1rem; color: #444; font-size: 0.7rem; font-weight: 900; }
        td { padding: 1.2rem 1rem; background: rgba(255,255,255,0.02); border-top: 1px solid rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05); }
        tr td:first-child { border-left: 1px solid rgba(255,255,255,0.05); border-radius: 10px 0 0 10px; }
        tr td:last-child { border-right: 1px solid rgba(255,255,255,0.05); border-radius: 0 10px 10px 0; }
      }
      .op-name { font-weight: 700; color: #fff; }
    }

    .empty-log { text-align: center; padding: 2rem; color: #444; font-weight: 800; letter-spacing: 2px; }

    @media (max-width: 768px) {
      .welcome-header { flex-direction: column; text-align: center; gap: 1rem; }
      .lite-stat { text-align: center; }
    }
  `],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(100, [
            animate('0.4s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class UserDashboardComponent implements OnInit {
  gameService = inject(GameService);
  authService = inject(AuthService);
  fx = inject(FxService);

  myScores: Score[] = [];
  topScore = 0;
  latestGame = 'N/A';

  games = [
    { id: 'tic-tac-toe', name: 'TIC TAC TOE', icon: 'bi-grid-3x3' },
    { id: 'snake', name: 'SNAKE OPS', icon: 'bi-vector-pen' },
    { id: 'brick-breaker', name: 'BREAKOUT', icon: 'bi-bricks' },
    { id: 'rock-paper-scissors', name: 'COMBAT RPS', icon: 'bi-hand-thumbs-up' },
    { id: 'memory', name: 'NEURAL LINK', icon: 'bi-card-list' },
    { id: 'number-guess', name: 'CIPHER HINT', icon: 'bi-question-circle' },
    { id: 'hangman', name: 'DATA BREACH', icon: 'bi-person-x' },
    { id: 'game-2048', name: 'CORE MERGE', icon: 'bi-app' },
    { id: 'connect-four', name: 'LINK FOUR', icon: 'bi-grid-4x4' },
    { id: 'reaction-timer', name: 'REFLEX TEST', icon: 'bi-stopwatch' },
  ];

  ngOnInit() {
    this.gameService.getMyScores().subscribe(scores => {
      this.myScores = scores;
      if (scores.length > 0) {
        this.topScore = Math.max(...scores.map(s => s.score));
        this.latestGame = scores[0].gameName;
      }
    });
  }
}
