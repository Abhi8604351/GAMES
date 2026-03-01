import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { TopbarComponent } from '../../components/topbar/topbar.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, SidebarComponent, TopbarComponent],
  template: `
    <div class="layout-wrapper">
      <app-sidebar></app-sidebar>
      <div class="main-content">
        <app-topbar></app-topbar>
        <div class="content-area">
          <router-outlet></router-outlet>
        </div>
        <footer class="main-footer glass">
          <div class="footer-content">
            <span class="human-badge orbitron">MADE BY HUMAN</span>
            <div class="creator-info">
              <span class="label">LEAD ARCHITECT</span>
              <span class="name glow-blue">ABHISHEK SINGH</span>
            </div>
            <p class="copyright orbitron">NEON-PROTOCOL &copy; 2026</p>
          </div>
        </footer>
      </div>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      display: flex;
      min-height: 100vh;
    }

    .main-content {
      flex: 1;
      margin-left: 260px;
      display: flex;
      flex-direction: column;
      background: #0a0a0c;
    }

    .content-area {
      padding: 2rem;
      min-height: calc(100vh - 130px);
      flex: 1;
    }

    .main-footer {
      padding: 1.5rem 2.5rem;
      border-top: 1px solid rgba(0, 242, 255, 0.1);
      background: rgba(10, 10, 12, 0.8);
      backdrop-filter: blur(20px);
      z-index: 10;
    }

    .footer-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      max-width: 1200px;
      margin: 0 auto;
    }

    .human-badge {
      font-size: 0.65rem;
      letter-spacing: 5px;
      color: #666;
      padding: 4px 12px;
      border: 1px solid #333;
      border-radius: 4px;
      background: rgba(255,255,255,0.02);
      transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      &:hover {
        color: #fff;
        border-color: #7000ff;
        box-shadow: 0 0 10px rgba(112, 0, 255, 0.5);
        transform: translateY(-2px) scale(1.05);
      }
    }

    .creator-info {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      .label { font-size: 0.55rem; color: #444; font-weight: 900; letter-spacing: 1px; }
      .name { font-family: 'Orbitron'; font-size: 0.85rem; font-weight: 900; letter-spacing: 2px; }
    }

    .copyright {
      font-size: 0.65rem;
      color: #333;
      font-weight: 800;
      letter-spacing: 1px;
    }

    @media (max-width: 992px) {
      .main-content {
        margin-left: 0;
      }
      app-sidebar {
        display: none;
      }
      .footer-content {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }
  `]
})
export class MainLayoutComponent { }
