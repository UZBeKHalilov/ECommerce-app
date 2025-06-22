import { Component, inject } from "@angular/core"
import { CommonModule } from "@angular/common"
import { FormBuilder, type FormGroup, ReactiveFormsModule, Validators } from "@angular/forms"
// import { ContactService } from "../../core/services/contact.service"

@Component({
  selector: "app-contact",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./contact.component.html",
  styleUrls: ["./contact.component.scss"],
})
export class ContactComponent {
  contactForm: FormGroup
  isSubmitting = false
  successMessage: string | null = null
  errorMessage: string | null = null

  private fb = inject(FormBuilder)
  // private contactService = inject(ContactService)

  constructor() {
    this.contactForm = this.fb.group({
      name: ["", Validators.required],
      email: ["", [Validators.required, Validators.email]],
      phone: ["", Validators.pattern("^[0-9]{10}$")],
      subject: ["", Validators.required],
      message: ["", [Validators.required, Validators.minLength(10)]],
    })
  }

  onSubmit(): void {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched()
      return
    }

    this.isSubmitting = true
    this.errorMessage = null
    this.successMessage = null

    const contactData = this.contactForm.value

    // this.contactService.sendMessage(contactData).subscribe({
    //   next: () => {
    //     this.isSubmitting = false
    //     this.successMessage = "Thank you for your message! We'll get back to you within 24 hours."
    //     this.contactForm.reset()
    //   },
    //   error: (err) => {
    //     this.isSubmitting = false
    //     this.errorMessage = err.message || "Failed to send message. Please try again."
    //     console.error("Contact form error:", err)
    //   },
    // })
  }

  // Helper methods for form validation
  get name() {
    return this.contactForm.get("name")
  }
  get email() {
    return this.contactForm.get("email")
  }
  get phone() {
    return this.contactForm.get("phone")
  }
  get subject() {
    return this.contactForm.get("subject")
  }
  get message() {
    return this.contactForm.get("message")
  }
}
