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
  profileForm: FormGroup
  passwordForm: FormGroup
  user: User | null = null
  customer: Customer | null = null
  isLoading = true
  isSaving = false
  isChangingPassword = false
  errorMessage: string | null = null
  successMessage: string | null = null
  activeTab: "profile" | "security" = "profile"

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
        this.populateForm()
        this.isLoading = false
      },
      error: (err) => {
        this.errorMessage = "Failed to load profile. Please try again."
        this.isLoading = false
        console.error("Error loading profile:", err)
      },
    })
  }

  populateForm(): void {
    if (this.user && this.customer) {
      this.profileForm.patchValue({
        firstName: this.customer.firstName,
        lastName: this.customer.lastName,
        email: this.customer.email,
        phoneNumber: this.customer.phoneNumber,
        address: this.customer.address,
        username: this.user.username,
      })
    }
  }

  onProfileSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched()
      return
    }

    this.isSaving = true
    this.errorMessage = null
    this.successMessage = null

    const profileData = {
      ...this.profileForm.value,
      username: this.user?.username,
    }

    this.userService.updateProfile(profileData).subscribe({
      next: () => {
        this.isSaving = false
        this.successMessage = "Profile updated successfully!"
        this.loadUserProfile() // Reload the profile to get the updated data
      },
      error: (err) => {
        this.isSaving = false
        this.errorMessage = err.message || "Failed to update profile. Please try again."
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
    this.errorMessage = null
    this.successMessage = null

    const passwordData = this.passwordForm.value

    this.userService.changePassword(passwordData).subscribe({
      next: () => {
        this.isChangingPassword = false
        this.successMessage = "Password changed successfully!"
        this.passwordForm.reset()
      },
      error: (err) => {
        this.isChangingPassword = false
        this.errorMessage = err.message || "Failed to change password. Please try again."
        console.error("Change password error:", err)
      },
    })
  }

  setActiveTab(tab: "profile" | "security"): void {
    this.activeTab = tab
    this.errorMessage = null
    this.successMessage = null
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
