import { Component } from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {AuthService} from "../../../shared/services/auth.service";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required]
    });
  }
  onSubmit(): void {
    if (this.registerForm.valid) {
      const { username, email, password, passwordConfirm } = this.registerForm.value;
      if (password === passwordConfirm) {
        this.authService.register({ username, password, email }).subscribe({
          next: () => this.router.navigate(['/login']),
          error: (err) => console.error('Registration failed', err)
        });
      } else {
        alert('Passwords do not match');
      }
    }
  }
}
