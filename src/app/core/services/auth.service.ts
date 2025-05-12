import { Injectable, Injector } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';

import { CartService } from './cart.service';

import { LoginData } from '../models/loginData.model';
import { RegisterData } from '../models/registerData.model';
import { LoginResponse } from '../models/loginResponse.model';

// interface LoginResponse {
//   token: string;
// }

// interface RegisterData {
//   username: string;
//   password: string;
//   role: string;
// }

// interface LoginData {
//   username: string;
//   password: string;
//   role: string;
// }

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = '/api/User';
  private tokenKey = 'jwt-token';
  private _isAdmin$ = new BehaviorSubject<boolean>(false);
  private _isLoggedIn$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient, private router: Router, private injector: Injector) {
    this.loadToken();
  }

  private get cartService(): CartService {
    return this.injector.get(CartService);
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
        this._isLoggedIn$.next(false);
        this._isAdmin$.next(false);
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

  register(data: RegisterData): Observable<{ message: string }> {
    return this.http.post(`${this.apiUrl}/register`, data, { responseType: 'text' }).pipe(
      tap((response: any) => {
        try {
          this.login(data as LoginData).subscribe(
            () => {
              console.log('Login successful after registration');
            }
          );
          return response;
        } catch {
          throw new Error('Invalid response format');
        }
      })
    );
  }

  login(data: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, data).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        const payload = this.decodePayload(res.token);
        this._isAdmin$.next(payload?.role === 'Admin');
        this._isLoggedIn$.next(true);
        this.router.navigate(['/'])
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this._isAdmin$.next(false);
    this._isLoggedIn$.next(false);
    this.cartService.removeCart();
    console.log('Logged out successfully!');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return typeof window !== 'undefined' ? localStorage.getItem(this.tokenKey) : null;
  }

  getApiUrl(): string {
    return this.apiUrl;
  }

  getCurrentUser(): Observable<any> {
    return this.http.get(`${this.apiUrl}/currentUser`);
  }
}