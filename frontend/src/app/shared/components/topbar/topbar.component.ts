import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <header class="topbar glass">
      <div class="system-status">
        <div class="scanner"></div>
        <span class="orbitron">SYS_ACTIVE</span>
        <div class="pulse-dot"></div>
      </div>
      
      <div class="user-profile" *ngIf="authService.currentUser() as user">
        <div class="user-info">
          <span class="user-name orbitron">{{user.name | uppercase}}</span>
          <span class="user-role">{{user.role}} // AGENT</span>
        </div>
        <div class="avatar-frame neon-border">
          <i class="bi bi-person-fill"></i>
          <div class="corner t-l"></div>
          <div class="corner b-r"></div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    .topbar {
      height: 70px;
      padding: 0 2rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: sticky;
      top: 0;
      z-index: 900;
      border-bottom: 1px solid rgba(0, 242, 255, 0.1);
    }

    .system-status {
      display: flex;
      align-items: center;
      gap: 12px;
      color: #00f2ff;
      font-size: 0.7rem;
      letter-spacing: 2px;
      font-weight: 800;
    }

    .pulse-dot {
      width: 6px;
      height: 6px;
      background: #00f2ff;
      border-radius: 50%;
      box-shadow: 0 0 10px #00f2ff;
      animation: pulse-glow 2s infinite;
    }

    .scanner {
      width: 40px;
      height: 2px;
      background: linear-gradient(90deg, transparent, #00f2ff, transparent);
      position: relative;
      overflow: hidden;
      &::after {
        content: '';
        position: absolute;
        top: 0; left: -100%; width: 100%; height: 100%;
        background: inherit;
        animation: scan 2s linear infinite;
      }
    }

    @keyframes scan {
      0% { left: -100%; }
      100% { left: 100%; }
    }

    .user-profile {
      display: flex;
      align-items: center;
      gap: 1.2rem;
    }

    .user-info {
      display: flex;
      flex-direction: column;
      text-align: right;
    }

    .user-name {
      font-weight: 900;
      font-size: 1rem;
      color: #fff;
    }

    .user-role {
      font-size: 0.65rem;
      color: #666;
      font-weight: 800;
    }

    .avatar-frame {
      width: 45px;
      height: 45px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      color: #00f2ff;
      position: relative;
      background: rgba(0, 242, 255, 0.05);
      border-radius: 4px;

      .corner {
        position: absolute;
        width: 6px; height: 6px;
        border: 2px solid #00f2ff;
        &.t-l { top: -2px; left: -2px; border-right: 0; border-bottom: 0; }
        &.b-r { bottom: -2px; right: -2px; border-left: 0; border-top: 0; }
      }
    }
  `]
})
export class TopbarComponent {
  authService = inject(AuthService);
}
