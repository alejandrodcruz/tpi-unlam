import { Routes } from '@angular/router';
import { HomeComponent } from './routes/home/home.component';
import { LoginComponent } from './routes/auth/login/login.component';
import { RegisterComponent } from './routes/auth/register/register.component';
import { DashboardComponent } from './routes/dashboard/dashboard/dashboard.component';
import { ReportesComponent } from './routes/reportes/reportes.component';
import { ReportesHistoricosComponent } from './routes/reportes/reportes-historicos/reportes-historicos.component';
import { ConfiguracionComponent } from './routes/configuracion/configuracion.component';
import { MisDispositivosComponent} from './routes/mis-dispositivos/mis-dispositivos.component';
import { GuidesComponent } from './routes/guides/guides.component';
import { LandingPageComponent } from './routes/landing-page/landing-page.component';
import { DashboardHistoricoComponent } from './routes/dashboard-historico/dashboard-historico.component';
import { CarbonFootprintComponent } from './routes/carbon-footprint/carbon-footprint/carbon-footprint.component';
import {AlertsComponent} from "./routes/alerts/alerts.component";
import { MisuscriptionComponent } from "./routes/misuscription/misuscription.component";
import {ConsumeComponent} from "./routes/consume/consume.component";



export const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'landing', component:  LandingPageComponent},
  { path: '', redirectTo: '/landing', pathMatch: 'full' },
  {
    path: 'home',
    component: HomeComponent,  // HomeComponent actúa como layout principal
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'dispositivos', component: MisDispositivosComponent },
      { path: 'configuracion', component: ConfiguracionComponent },
      { path: 'reportes', component: ReportesComponent },
      { path: 'reportesHistoricos', component: ReportesHistoricosComponent },
      { path: 'historico', component: DashboardHistoricoComponent },
      { path: 'guides', component: GuidesComponent},
      { path: 'huella', component:CarbonFootprintComponent},
      { path: 'alerts', component: AlertsComponent },
      { path: 'consume', component: ConsumeComponent },
      { path: 'misuscription', component: MisuscriptionComponent },
    ]
  },
];
