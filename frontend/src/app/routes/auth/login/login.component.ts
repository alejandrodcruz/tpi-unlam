import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string= '';
password: string= '';

constructor(private authService: AuthService, private router: Router){
}
onSubmit() {
  this.authService.login(this.email, this.password).subscribe({
   next: ()=> this.router.navigate(['/dashboard']),
   error: (err) => console.error('Login failed', err)
  })
}

}
