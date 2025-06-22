import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { RouterModule } from "@angular/router"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { AuthService } from "../../core/services/auth.service"
// import { LoginResponse } from "../../core/models/loginResponse.model"
import { RegisterData } from "../../core/models/registerData.model"
import { LoginData } from "../../core/models/loginData.model"
import { AsyncPipe } from "@angular/common"
// import { SocialAuthService, GoogleLoginProvider, SocialUser } from '@abacritt/angularx-social-login';

@Component({
  selector: "app-auth",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.scss"],
})
export class AuthComponent {
  activeTab: "login" | "register" = "login"
  loginForm: FormGroup
  registerForm: FormGroup
  isLoading = false
  errorMessage: string | null = null
  successMessage: string | null = null
  // user: SocialUser | null = null

  private fb = inject(FormBuilder)
  private authService = inject(AuthService)

  constructor( 
    // private socialAuthService: SocialAuthService
  ) {
    // this.socialAuthService.authState.subscribe((user) => {
    //   this.user = user;
    // });

    this.loginForm = this.fb.group({
      username: ["", [Validators.required, Validators.minLength(6)]],
      password: ["", [Validators.required, Validators.minLength(6)]],
      rememberMe: [false],
    })

    this.registerForm = this.fb.group(
      {
        username: ["", [Validators.required, Validators.minLength(6)]],
        password: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
        agreeToTerms: [false],
      },
      { validators: this.passwordMatchValidator },
    )
  }

  onGoogleLogin(): void {
    this.errorMessage = "Google login is not implemented yet.";
    // this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID);
  }

  // signOut(): void {
  //   this.socialAuthService.signOut();
  // }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get("password")?.value
    const confirmPassword = form.get("confirmPassword")?.value

    if (password !== confirmPassword) {
      form.get("confirmPassword")?.setErrors({ passwordMismatch: true })
      return { passwordMismatch: true }
    }

    return null
  }

  setActiveTab(tab: "login" | "register"): void {
    this.activeTab = tab
    this.errorMessage = null
    this.successMessage = null
  }

  onLoginSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched()
      return
    }

    this.isLoading = true
    this.errorMessage = null

    const { username ,password } = this.loginForm.value
    const loginData: LoginData = { username, passwordHash: password} // Assuming role is "User" for login;
    this.authService.login(loginData).subscribe({
      next: () => {
        this.isLoading = false
        // Navigate to home or dashboard
        // this.router.navigate(['/'])
      },
      error: (err) => {
        this.isLoading = false
        this.errorMessage = err.message || "Failed to login. Please try again."
        console.error("Login error:", err)
      },
    })
  }

  onRegisterSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched()
      this.errorMessage = "Please fill out all required fields correctly."
      return
    }
    console.log("Register form submitted:", this.registerForm.value)

    this.isLoading = true
    this.errorMessage = null

    const { username, password } = this.registerForm.value
    const registerData: RegisterData = { username, passwordHash: password, role: "Customer" } // Assuming role is "User" for registration

    this.authService.register(registerData).subscribe({
      next: () => {
        this.isLoading = false
        this.successMessage = "Registration successful! You can now login."
        this.setActiveTab("login")
        this.registerForm.reset()
      },
      error: (err) => {
        this.isLoading = false
        this.errorMessage = err.message || "Failed to register. Please try again."
        console.error("Registration error:", err)
      },
    })
  }

  // Helper methods for form validation
  get loginEmail() {
    return this.loginForm.get("email")
  }
  get loginPassword() {
    return this.loginForm.get("password")
  }
  get loginRememberMe() {
    return this.loginForm.get("rememberMe")
  }
  get loginUsername() {
    return this.loginForm.get("username")
  }
  
  get registerUsername() {
    return this.registerForm.get("username")
  }
  get registerFirstName() {
    return this.registerForm.get("firstName")
  }
  get registerLastName() {
    return this.registerForm.get("lastName")
  }
  get registerEmail() {
    return this.registerForm.get("email")
  }
  get registerPassword() {
    return this.registerForm.get("password")
  }
  get registerConfirmPassword() {
    return this.registerForm.get("confirmPassword")
  }
  get registerAgreeToTerms() {
    return this.registerForm.get("agreeToTerms")
  }
}
