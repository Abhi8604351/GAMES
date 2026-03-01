import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './core/guards/auth.guard';

export const routes: Routes = [
    {
        path: 'auth',
        loadComponent: () => import('./auth/auth.component').then(m => m.AuthComponent)
    },
    {
        path: '',
        redirectTo: 'user/dashboard',
        pathMatch: 'full'
    },
    {
        path: 'user',
        canActivate: [authGuard],
        loadComponent: () => import('./shared/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./user/dashboard/dashboard.component').then(m => m.UserDashboardComponent)
            },
            {
                path: 'games/tic-tac-toe',
                loadComponent: () => import('./user/games/tic-tac-toe/tic-tac-toe.component').then(m => m.TicTacToeComponent)
            },
            {
                path: 'games/snake',
                loadComponent: () => import('./user/games/snake/snake.component').then(m => m.SnakeComponent)
            },
            {
                path: 'games/brick-breaker',
                loadComponent: () => import('./user/games/brick-breaker/brick-breaker.component').then(m => m.BrickBreakerComponent)
            },
            {
                path: 'games/rock-paper-scissors',
                loadComponent: () => import('./user/games/rock-paper-scissors/rock-paper-scissors.component').then(m => m.RPSComponent)
            },
            {
                path: 'games/memory',
                loadComponent: () => import('./user/games/memory/memory.component').then(m => m.MemoryComponent)
            },
            {
                path: 'games/number-guess',
                loadComponent: () => import('./user/games/number-guess/number-guess.component').then(m => m.NumberGuessComponent)
            },
            {
                path: 'games/hangman',
                loadComponent: () => import('./user/games/hangman/hangman.component').then(m => m.HangmanComponent)
            },
            {
                path: 'games/game-2048',
                loadComponent: () => import('./user/games/game-2048/game-2048.component').then(m => m.Game2048Component)
            },
            {
                path: 'games/connect-four',
                loadComponent: () => import('./user/games/connect-four/connect-four.component').then(m => m.ConnectFourComponent)
            },
            {
                path: 'games/reaction-timer',
                loadComponent: () => import('./user/games/reaction-timer/reaction-timer.component').then(m => m.ReactionTimerComponent)
            }
        ]
    },
    {
        path: 'admin',
        canActivate: [authGuard, adminGuard],
        loadComponent: () => import('./shared/layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
        children: [
            {
                path: 'dashboard',
                loadComponent: () => import('./admin/dashboard/dashboard.component').then(m => m.AdminDashboardComponent)
            }
        ]
    },
    { path: '**', redirectTo: 'auth' }
];
