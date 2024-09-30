import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../../shared/services/auth.service";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],  // Asegúrate de importar ReactiveFormsModule y CommonModule
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  passwordMismatch: boolean = false;
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
    const { password, passwordConfirm } = this.registerForm.value;
    if (password !== passwordConfirm) {
      this.passwordMismatch = true;  // Establece `passwordMismatch` si las contraseñas no coinciden
      return;
    }

    if (this.registerForm.valid) {
      this.passwordMismatch = false;  // Resetea el valor si coinciden
      const { username, email } = this.registerForm.value;
      this.authService.register({ username, password, email }).subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err) => console.error('Registration failed', err)
      });
    }
  }
}
