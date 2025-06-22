import { Component, type OnInit, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
import { UserService } from "../../core/services/user.service"
import type { Customer, User } from "../../core/models/user.model"

@Component({
  selector: "app-profile",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./profile.component.html",
  styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {
  activeSection: "profile" | "edit" | "password" = "profile"

  // Profile data
  user: User | null = null
  customer: Customer | null = null

  // Forms
  profileForm: FormGroup
  passwordForm: FormGroup

  // Loading states
  isLoading = true
  isSavingProfile = false
  isChangingPassword = false

  // Messages
  profileSuccessMessage: string | null = null
  profileErrorMessage: string | null = null
  passwordSuccessMessage: string | null = null
  passwordErrorMessage: string | null = null

  private fb = inject(FormBuilder)
  private userService = inject(UserService)

  constructor() {
    this.profileForm = this.fb.group({
      firstName: ["", Validators.required],
      lastName: [""],
      email: ["", [Validators.required, Validators.email]],
      phoneNumber: ["", Validators.pattern("^[0-9]{10}$")],
      address: [""],
      username: [{ value: "", disabled: true }],
    })

    this.passwordForm = this.fb.group(
      {
        currentPassword: ["", Validators.required],
        newPassword: ["", [Validators.required, Validators.minLength(6)]],
        confirmPassword: ["", Validators.required],
      },
      { validators: this.passwordMatchValidator },
    )
  }

  ngOnInit(): void {
    this.loadUserProfile()
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get("newPassword")?.value
    const confirmPassword = form.get("confirmPassword")?.value

    if (newPassword !== confirmPassword) {
      form.get("confirmPassword")?.setErrors({ passwordMismatch: true })
      return { passwordMismatch: true }
    }

    return null
  }

  loadUserProfile(): void {
    this.isLoading = true
    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.user = user
        this.customer = user.customer || null
        this.populateProfileForm()
        this.isLoading = false
      },
      error: (err) => {
        this.profileErrorMessage = "Failed to load profile. Please try again."
        this.isLoading = false
        console.error("Error loading profile:", err)
      },
    })
  }

  populateProfileForm(): void {
    if (this.user && this.customer) {
      this.profileForm.patchValue({
        firstName: this.customer.firstName,
        lastName: this.customer.lastName,
        email: this.customer.user?.email || "",
        phoneNumber: this.customer.phoneNumber,
        address: this.customer.address,
        username: this.user.username,
      })
    }
  }

  setActiveSection(section: "profile" | "edit" | "password"): void {
    this.activeSection = section
    this.clearMessages()
  }

  clearMessages(): void {
    this.profileSuccessMessage = null
    this.profileErrorMessage = null
    this.passwordSuccessMessage = null
    this.passwordErrorMessage = null
  }

  onProfileSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched()
      return
    }

    this.isSavingProfile = true
    this.clearMessages()

    const profileData = {
      ...this.profileForm.value,
      username: this.user?.username,
    }

    this.userService.updateProfile(profileData).subscribe({
      next: () => {
        this.isSavingProfile = false
        this.profileSuccessMessage = "Profile updated successfully!"
        this.loadUserProfile() // Reload to get updated data
      },
      error: (err) => {
        this.isSavingProfile = false
        this.profileErrorMessage = err.message || "Failed to update profile. Please try again."
        console.error("Update profile error:", err)
      },
    })
  }

  onPasswordSubmit(): void {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched()
      return
    }

    this.isChangingPassword = true
    this.clearMessages()

    const passwordData = this.passwordForm.value

    this.userService.changePassword(passwordData).subscribe({
      next: () => {
        this.isChangingPassword = false
        this.passwordSuccessMessage = "Password changed successfully!"
        this.passwordForm.reset()
      },
      error: (err) => {
        this.isChangingPassword = false
        this.passwordErrorMessage = err.message || "Failed to change password. Please try again."
        console.error("Change password error:", err)
      },
    })
  }

  // Helper methods for form validation
  get firstName() {
    return this.profileForm.get("firstName")
  }
  get lastName() {
    return this.profileForm.get("lastName")
  }
  get email() {
    return this.profileForm.get("email")
  }
  get phoneNumber() {
    return this.profileForm.get("phoneNumber")
  }
  get address() {
    return this.profileForm.get("address")
  }

  get currentPassword() {
    return this.passwordForm.get("currentPassword")
  }
  get newPassword() {
    return this.passwordForm.get("newPassword")
  }
  get confirmPassword() {
    return this.passwordForm.get("confirmPassword")
  }
}
