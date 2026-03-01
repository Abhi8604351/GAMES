import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

export interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    token: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private apiUrl = '/api/auth';
    currentUser = signal<User | null>(this.getUserFromStorage());

    constructor(private http: HttpClient, private router: Router) { }

    register(userData: any): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/register`, userData).pipe(
            tap(user => this.setSession(user))
        );
    }

    login(credentials: any): Observable<User> {
        return this.http.post<User>(`${this.apiUrl}/login`, credentials).pipe(
            tap(user => this.setSession(user))
        );
    }

    logout() {
        localStorage.removeItem('user');
        this.currentUser.set(null);
        this.router.navigate(['/auth']);
    }

    private setSession(user: User) {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUser.set(user);
    }

    private getUserFromStorage(): User | null {
        const userJson = localStorage.getItem('user');
        return userJson ? JSON.parse(userJson) : null;
    }

    getToken(): string | null {
        return this.currentUser()?.token || null;
    }

    isAdmin(): boolean {
        return this.currentUser()?.role === 'admin';
    }

    isAuthenticated(): boolean {
        return !!this.currentUser();
    }
}
