import { Component } from '@angular/core';
import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: 'app-google-login',
  standalone: true,
  template: `
    <button (click)="signInWithGoogle()">Login with Google</button>
    <div *ngIf="user">
      <!-- <p>Welcome, {{ user.name }}</p>
      <img [src]="user.photoUrl" alt="Profile Image" width="50"> -->
      <button (click)="signOut()">Logout</button>
    </div>
  `,
})
export class GoogleLoginComponent {
  user: SocialUser | null = null;

  constructor(private authService: SocialAuthService) {
    this.authService.authState.subscribe((user) => {
      this.user = user;
    });
  }

  signInWithGoogle(): void {
    this.authService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  signOut(): void {
    this.authService.signOut();
  }
}
