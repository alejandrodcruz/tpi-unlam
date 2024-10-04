import { Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { LoginComponent } from './routes/auth/login/login.component';
import { RegisterComponent } from './routes/auth/register/register.component';
import { DashboardComponent } from './routes/dashboard/dashboard/dashboard.component';
import { SidebarComponent } from './core/sidebar/sidebar.component';
import { ReportesComponent } from './routes/reportes/reportes.component';
import { ReportesHistoricosComponent } from './routes/reportes/reportes-historicos/reportes-historicos.component';
import { ConfiguracionComponent } from './routes/configuracion/configuracion.component';
<<<<<<< HEAD
import { HuellaCarbonoComponent } from "./routes/huella-carbono/huella-carbono.component";
=======
import {
  DashboardHistoricoComponent
} from "./routes/dashboard-historico/dashboard-historico/dashboard-historico.component";
import {HuellaCarbonoComponent} from "./routes/huella-carbono/huella-carbono.component";
>>>>>>> parent of 99cb6390 (Mydevice)
import { LandingPageComponent } from './routes/landing-page/landing-page.component';
import { DashboardHistoricoComponent } from './routes/dashboard-historico/dashboard-historico.component';


export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'landing', component:  LandingPageComponent},
  /*{ path: '', redirectTo: '/landing', pathMatch: 'full' },*/
  {
    path: '',
    component: HomeComponent,  // HomeComponent actúa como layout principal
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'configuracion', component: ConfiguracionComponent },
      { path: 'reportes', component: ReportesComponent },
      { path: 'reportesHistoricos', component: ReportesHistoricosComponent },
      { path: 'historico', component: DashboardHistoricoComponent },
      { path: 'huella', component: HuellaCarbonoComponent },
    ]
  },
];
