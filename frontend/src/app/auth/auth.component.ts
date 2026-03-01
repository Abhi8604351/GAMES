import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, User } from '../core/services/auth.service';
import { trigger, transition, style, animate, state } from '@angular/animations';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  template: `
    <div class="auth-view animate-fade-in">
      <div class="background-effects">
         <div class="glow-sphere s1"></div>
         <div class="glow-sphere s2"></div>
      </div>

      <div class="auth-card glass neon-border" [@toggle]="isLogin ? 'login' : 'register'">
        <div class="auth-header">
          <h1 class="orbitron glow-blue">FUNZONE</h1>
          <div class="status-badge">AUTHENTICATOR_V1.0</div>
          <p class="text-dim">{{isLogin ? 'RESUME SESSION_ID' : 'INITIALIZE NEW_AGENT'}}</p>
        </div>

        <form [formGroup]="authForm" (ngSubmit)="onSubmit()" class="auth-form">
          <div class="input-group" *ngIf="!isLogin" [@fade]>
            <label class="orbitron">USER_ALIAS</label>
            <div class="input-wrapper">
               <i class="bi bi-person-fill"></i>
               <input type="text" formControlName="name" placeholder="Agent Name">
            </div>
          </div>

          <div class="input-group">
            <label class="orbitron">IDENT_EMAIL</label>
            <div class="input-wrapper">
               <i class="bi bi-envelope-fill"></i>
               <input type="email" formControlName="email" placeholder="email@nexus.com">
            </div>
          </div>

          <div class="input-group">
            <label class="orbitron">ACCESS_KEY</label>
            <div class="input-wrapper">
               <i class="bi bi-shield-lock-fill"></i>
               <input type="password" formControlName="password" placeholder="••••••••">
            </div>
          </div>

          <div class="error-panel" *ngIf="error" [@fade]>
             <i class="bi bi-exclamation-triangle"></i> {{error}}
          </div>

          <button type="submit" class="auth-btn neon-border" [disabled]="loading">
            <span *ngIf="!loading">{{isLogin ? 'INITIATE LOGIN' : 'REGISTER AGENT'}}</span>
            <div *ngIf="loading" class="loader"></div>
          </button>
        </form>

        <div class="auth-footer">
          <a (click)="toggleMode()">
            {{isLogin ? "REQ_ACCOUNT // REGISTER" : "BACK_TO_LOGIN // ACCESS"}}
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-view {
      height: 100vh; width: 100vw; display: flex; align-items: center; justify-content: center;
      background: #050507; position: relative; overflow: hidden;
    }
    
    .background-effects {
      position: absolute; width: 100%; height: 100%;
      .glow-sphere {
        position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.15;
        &.s1 { width: 500px; height: 500px; top: -100px; left: -100px; background: #00f2ff; }
        &.s2 { width: 400px; height: 400px; bottom: -50px; right: -50px; background: #7000ff; }
      }
    }

    .auth-card {
      padding: 3.5rem; border-radius: 24px; width: 100%; max-width: 450px; z-index: 10;
      box-shadow: 0 20px 50px rgba(0,0,0,0.8);
    }

    .auth-header {
      text-align: center; margin-bottom: 2.5rem;
      h1 { font-size: 2.8rem; font-weight: 900; margin: 0; }
      .status-badge { font-size: 0.6rem; color: #444; font-weight: 800; letter-spacing: 2px; margin: 0.5rem 0; }
      p { font-size: 0.85rem; font-weight: 700; }
    }

    .auth-form { display: flex; flex-direction: column; gap: 1.5rem; }
    
    .input-group {
      label { display: block; font-size: 0.65rem; color: #666; margin-bottom: 0.8rem; font-weight: 900; }
      .input-wrapper {
        position: relative;
        i { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #444; }
        input {
          width: 100%; padding: 0.9rem 1rem 0.9rem 2.8rem; border-radius: 12px;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
          color: #fff; font-family: 'Rajdhani', sans-serif; font-weight: 600; outline: none;
          box-sizing: border-box; transition: all 0.3s;
          &:focus { border-color: #00f2ff; background: rgba(0,242,255,0.05); }
        }
      }
    }

    .auth-btn {
      margin-top: 1rem; padding: 1rem; border-radius: 12px; background: rgba(0, 242, 255, 0.05);
      color: #00f2ff; font-family: 'Orbitron'; font-weight: 800; font-size: 0.9rem; cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      &:hover { background: #00f2ff; color: #000; box-shadow: 0 0 30px #00f2ff; }
      &:disabled { opacity: 0.5; cursor: not-allowed; }
    }

    .error-panel {
      padding: 0.8rem; background: rgba(255, 77, 77, 0.1); border-radius: 8px;
      color: #ff4d4d; font-size: 0.8rem; font-weight: 700; text-align: center;
      i { margin-right: 8px; }
    }

    .auth-footer {
      margin-top: 2.5rem; text-align: center;
      a { color: #666; cursor: pointer; font-size: 0.75rem; font-family: 'Orbitron'; font-weight: 800; letter-spacing: 1px; &:hover { color: #00f2ff; } }
    }

    .loader {
      width: 20px; height: 20px; border: 3px solid rgba(0, 242, 255, 0.3); border-top-color: #00f2ff;
      border-radius: 50%; animation: spin 0.8s linear infinite;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  `],
  animations: [
    trigger('toggle', [
      state('login', style({ transform: 'scale(1)' })),
      state('register', style({ transform: 'scale(1.02)' })),
      transition('login <=> register', animate('0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'))
    ]),
    trigger('fade', [
      transition(':enter', [style({ opacity: 0 }), animate('0.3s', style({ opacity: 1 }))]),
      transition(':leave', [animate('0.2s', style({ opacity: 0 }))])
    ])
  ]
})
export class AuthComponent {
  fb = inject(FormBuilder);
  authService = inject(AuthService);
  router = inject(Router);

  isLogin = true;
  loading = false;
  error = '';

  authForm = this.fb.group({
    name: [''],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  toggleMode() {
    this.isLogin = !this.isLogin;
    this.error = '';
  }

  onSubmit() {
    if (this.authForm.invalid) return;
    this.loading = true;
    this.error = '';

    const obs = this.isLogin
      ? this.authService.login(this.authForm.value)
      : this.authService.register(this.authForm.value);

    obs.subscribe({
      next: (user: User) => {
        this.loading = false;
        this.router.navigate([user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard']);
      },
      error: (err: any) => {
        this.loading = false;
        this.error = err.error?.message || 'CRITICAL_AUTH_FAILURE';
      }
    });
  }
}
