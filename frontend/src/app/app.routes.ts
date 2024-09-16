import { Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { LoginComponent } from './routes/auth/login/login.component';
import { RegisterComponent } from './routes/auth/register/register.component';
import { DashboardComponent } from './routes/dashboard/dashboard/dashboard.component';

export const routes: Routes = [

  {path: 'dashboard', component:DashboardComponent},
  {path: 'home', component:HomeComponent},
  {path: 'login', component: LoginComponent },
  {path: 'register', component: RegisterComponent },
  {path: '',redirectTo:'/home', pathMatch:'full'}
];
