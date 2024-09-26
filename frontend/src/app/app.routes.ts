import { Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { LoginComponent } from './routes/auth/login/login.component';
import { RegisterComponent } from './routes/auth/register/register.component';
import { DashboardComponent } from './routes/dashboard/dashboard/dashboard.component';
import { SidebarComponent } from './routes/sidebar/sidebar.component';
import { ReportesComponent } from './routes/reportes/reportes.component';
import { ReportesHistoricosComponent } from './routes/reportes/reportes-historicos/reportes-historicos.component';
import { ConfiguracionComponent } from './routes/configuracion/configuracion.component';
import { GuidesComponent } from './routes/guides/guides.component';

import {
  DashboardHistoricoComponent
} from './routes/dashboard-historico/dashboard-historico/dashboard-historico.component';


export const routes: Routes = [

  {path: 'dashboard', component:DashboardComponent},
  {path: 'home', component:HomeComponent},
  {path: 'configuracion', component:ConfiguracionComponent},
  {path: 'sidebar', component:SidebarComponent},
  {path: 'reportes', component:ReportesComponent},
  {path: 'reportesHistoricos', component:ReportesHistoricosComponent},
  {path: 'login', component: LoginComponent },
  {path: 'register', component: RegisterComponent },
  {path: 'historico', component: DashboardHistoricoComponent },
  {path: 'guides', component: GuidesComponent},
  {path: '',redirectTo:'/home', pathMatch:'full'}
];
