import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

interface LoginResponse {
  token: string;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  username: string;
  password: string;
}

@Injectable({providedIn: 'root'})
export class AuthService {
  private apiUrl = '/api';
  private tokenKey = 'jwt-token';
  private _isAdmin$ = new BehaviorSubject<boolean>(false);
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    this.loadToken();
  }

  private loadToken() {
    if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
      const token = localStorage.getItem(this.tokenKey);
      if (token) {
        this._isLoggedIn$.next(true);
        const payload = this.decodePayload(token);
        this._isAdmin$.next(payload?.role === 'Admin');

        console.log('Loaded token:', token);
      } else {
        console.log('No token found in localStorage');
      }
    }
  }

  private decodePayload(token: string): any {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch {
      return null;
    }
  }

  get isAdmin$(): Observable<boolean> {
    return this._isAdmin$.asObservable();
  }
  get isLoggedIn$(): Observable<boolean> {
    return this._isLoggedIn$.asObservable();
  }

  register(data: RegisterData): Observable<{message:string}> {
    return this.http.post<{message:string}>(`${this.apiUrl}/register`, data);
  }

  login(data: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        const payload = this.decodePayload(res.token);
        this._isAdmin$.next(payload?.role === 'Admin');
        this._isLoggedIn$.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this._isAdmin$.next(false);
    this._isLoggedIn$.next(false);
  }

  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem(this.tokenKey) : null;
  }

  getApiUrl(): string {
    return this.apiUrl;
  }
}