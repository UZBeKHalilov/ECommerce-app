import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {Customer, User, ProfileUpdateRequest} from '../models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = '/api/Customer';
  constructor(private http: HttpClient, private router: Router, private authService: AuthService) {}

  getCurrentUser(): Observable<User> {
    return this.authService.getCurrentUser();
  }

  updateProfile(data: ProfileUpdateRequest): Observable<{message: string}> {
    return this.http.put(`${this.apiUrl}/profile`, data, { responseType: 'text' }).pipe(
      tap((response: any) => {
        try {
          this.authService.login(data as any).subscribe(
            () => {
              console.log('Login successful after profile update');
            }
          );
          return response;
        } catch {
          throw new Error('Invalid response format');
        }
      })
    );
  }

  changePassword(data: ProfileUpdateRequest): Observable<{message: string}> {
    return this.http.put(`${this.apiUrl}/password`, data, { responseType: 'text' }).pipe(
      tap((response: any) => {
        try {
          this.authService.login(data as any).subscribe(
            () => {
              console.log('Login successful after password change');
            }
          );
          return response;
        } catch {
          throw new Error('Invalid response format');
        }
      })
    );
  }
}
