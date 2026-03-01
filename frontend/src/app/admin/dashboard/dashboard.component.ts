import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from '../../core/services/admin.service';
import { User } from '../../core/services/auth.service';
import { Score } from '../../core/services/game.service';

@Component({
    selector: 'app-admin-dashboard',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="admin-dashboard">
      <h2 class="neon-text mb-4">Admin Dashboard</h2>

      <div class="stats-grid mb-4">
        <div class="neon-card">
          <h4>Total Users</h4>
          <span class="value">{{users.length}}</span>
        </div>
        <div class="neon-card">
          <h4>Total Games Played</h4>
          <span class="value">{{allScores.length}}</span>
        </div>
      </div>

      <div class="sections-grid">
        <div class="neon-card">
          <h3>Manage Users</h3>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let u of users">
                  <td>{{u.name}}</td>
                  <td>{{u.email}}</td>
                  <td [class.admin-text]="u.role === 'admin'">{{u.role}}</td>
                  <td>
                    <button *ngIf="u.role !== 'admin'" (click)="deleteUser(u._id)" class="btn-delete">
                      <i class="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="neon-card">
          <h3>Global Leaderboard</h3>
          <div class="table-container">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Game</th>
                  <th>Score</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let s of allScores.slice(0, 10)">
                  <td>{{s.userId?.name || 'Deleted User'}}</td>
                  <td>{{s.gameName}}</td>
                  <td class="neon-text">{{s.score}}</td>
                  <td>{{s.playedAt | date:'shortDate'}}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .admin-dashboard { display: flex; flex-direction: column; gap: 2rem; }
    .mb-4 { margin-bottom: 2rem; }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem; }
    .value { font-size: 2.5rem; font-weight: 800; color: #00f2ff; }
    .sections-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
    h3 { margin-bottom: 1.5rem; font-family: 'Orbitron', sans-serif; font-size: 1.2rem; }
    .table-container { overflow-x: auto; }
    table {
      width: 100%; border-collapse: collapse;
      th { text-align: left; padding: 1rem; color: #666; font-size: 0.8rem; border-bottom: 1px solid rgba(255,255,255,0.05); }
      td { padding: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); font-size: 0.9rem; }
    }
    .admin-text { color: #ff00c8; font-weight: 600; }
    .btn-delete { background: none; border: none; color: #ff4d4d; cursor: pointer; font-size: 1.1rem; &:hover { color: #ff0000; } }
    @media (max-width: 1200px) { .sections-grid { grid-template-columns: 1fr; } }
  `]
})
export class AdminDashboardComponent implements OnInit {
    adminService = inject(AdminService);
    users: User[] = [];
    allScores: Score[] = [];

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.adminService.getUsers().subscribe(u => this.users = u);
        this.adminService.getAllScores().subscribe(s => this.allScores = s);
    }

    deleteUser(id: string) {
        if (confirm('Are you sure you want to delete this user?')) {
            this.adminService.deleteUser(id).subscribe(() => this.loadData());
        }
    }
}
