import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  form: any;

  message = '';
  error = '';
  
  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  // constructor(private fb: FormBuilder, private auth: AuthService) {}

  onSubmit() {
    if (this.form.invalid) return;
    this.auth.register(this.form.value).subscribe({
      next: (res) => (this.message = res.message),
      error: (err) => (this.error = err.error?.message || 'Registration failed'),
    });
  }
}