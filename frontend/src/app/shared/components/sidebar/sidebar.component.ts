import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="sidebar glass">
      <div class="logo-area">
        <h1 class="orbitron glow-blue">FUNZONE</h1>
        <div class="version">V2.4.0_PRO</div>
      </div>
      
      <nav class="nav-links">
        <a routerLink="/user/dashboard" routerLinkActive="active" class="nav-item">
          <div class="icon-box"><i class="bi bi-cpu"></i></div>
          <span>DASHBOARD</span>
        </a>
        
        <div class="nav-section-title">GAME_ROSTER</div>
        
        <div class="scroll-area">
          <a *ngFor="let game of games" 
             [routerLink]="['/user/games', game.id]" 
             routerLinkActive="active" 
             class="nav-item game-link">
            <div class="icon-box"><i [class]="'bi ' + game.icon"></i></div>
            <span>{{game.name}}</span>
          </a>
        </div>

        <ng-container *ngIf="authService.isAdmin()">
          <div class="nav-section-title">ADMIN_ACCESS</div>
          <a routerLink="/admin/dashboard" routerLinkActive="active" class="nav-item admin-link">
            <div class="icon-box"><i class="bi bi-shield-lock"></i></div>
            <span>SECURE PANEL</span>
          </a>
        </ng-container>
      </nav>

      <div class="sidebar-footer">
        <button (click)="authService.logout()" class="logout-btn neon-border">
          <i class="bi bi-power"></i> DISCONNECT
        </button>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 260px;
      height: 100vh;
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 1000;
      border-right: 1px solid rgba(0, 242, 255, 0.1);
    }

    .logo-area {
      padding: 2.5rem 1.5rem;
      text-align: center;
      h1 { font-size: 1.6rem; margin: 0; letter-spacing: 3px; font-weight: 900; }
      .version { font-size: 0.6rem; color: #444; font-weight: 800; margin-top: 5px; }
    }

    .nav-links {
      flex: 1;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }

    .scroll-area {
      flex: 1;
      overflow-y: auto;
      margin-bottom: 1rem;
      &::-webkit-scrollbar { width: 4px; }
      &::-webkit-scrollbar-thumb { background: rgba(0, 242, 255, 0.1); border-radius: 10px; }
    }

    .nav-section-title {
      padding: 1.5rem 0.8rem 0.5rem;
      font-size: 0.65rem;
      font-weight: 900;
      color: #333;
      letter-spacing: 2px;
    }

    .nav-item {
      display: flex;
      align-items: center;
      padding: 0.8rem 1rem;
      color: #666;
      text-decoration: none;
      border-radius: 8px;
      margin-bottom: 0.4rem;
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      letter-spacing: 1px;

      .icon-box {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(255,255,255,0.02);
        border-radius: 6px;
        margin-right: 12px;
        font-size: 1.1rem;
        transition: inherit;
      }

      &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.05);
        .icon-box { background: rgba(0, 242, 255, 0.1); color: #00f2ff; }
      }

      &.active {
        color: #00f2ff;
        background: rgba(0, 242, 255, 0.08);
        .icon-box { background: #00f2ff; color: #000; box-shadow: 0 0 15px #00f2ff; }
      }
    }

    .logout-btn {
      width: 100%;
      padding: 0.8rem;
      background: rgba(255, 77, 77, 0.05);
      border-color: rgba(255, 77, 77, 0.2);
      color: #ff4d4d;
      font-family: 'Orbitron';
      font-size: 0.75rem;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      transition: all 0.3s;
      &:hover { background: #ff4d4d; color: #fff; box-shadow: 0 0 20px #ff4d4d; }
    }

    .sidebar-footer {
      padding: 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.05);
    }
  `]
})
export class SidebarComponent {
  authService = inject(AuthService);

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
}
