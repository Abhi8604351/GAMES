import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from './auth.service';
import { Score } from './game.service';

@Injectable({
    providedIn: 'root'
})
export class AdminService {
    private apiUrl = '/api/admin';

    constructor(private http: HttpClient) { }

    getUsers(): Observable<User[]> {
        return this.http.get<User[]>(`${this.apiUrl}/users`);
    }

    deleteUser(id: string): Observable<any> {
        return this.http.delete(`${this.apiUrl}/user/${id}`);
    }

    getAllScores(): Observable<Score[]> {
        return this.http.get<Score[]>(`${this.apiUrl}/all-scores`);
    }
}
