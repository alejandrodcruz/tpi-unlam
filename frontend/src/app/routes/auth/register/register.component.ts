import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from "../../../shared/services/auth.service";
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from "@angular/forms";
import { CommonModule, Location } from '@angular/common';

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
    private fb: FormBuilder,
    private location: Location
  ) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordConfirm: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      country: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  addressTypeOptions = [
    { value: 'HOME', label: 'Casa' },
    { value: 'BUSINESS', label: 'Negocio' },
    { value: 'WORKSHOP', label: 'Taller' }
  ];

  goBack() {
    this.location.back(); // Navega a la página anterior
  }

  onSubmit(): void {
    const { password, passwordConfirm } = this.registerForm.value;

    // Verifica si las contraseñas coinciden
    if (password !== passwordConfirm) {
      this.passwordMismatch = true;
      return;
    }

    // Resetea la bandera si coinciden
    this.passwordMismatch = false;

    // Verifica si el formulario es válido antes de enviar
    if (this.registerForm.valid) {
      const { username, email, password, street, city, country, type } = this.registerForm.value;

      this.authService.register({ username, password, email, street, city, country, type }).subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: (err) => {
          console.error('Error en el registro:', err);
        }
      });
    } else {
      console.error('Formulario inválido');
    }
  }
}
