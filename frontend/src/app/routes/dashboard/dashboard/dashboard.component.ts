import { Component } from '@angular/core';
import {SidebarComponent} from "../../../core/sidebar/sidebar.component";
import {ReportesHistoricosComponent} from "../../reportes/reportes-historicos/reportes-historicos.component";
import {NavbarComponent} from "../navbar/navbar.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SidebarComponent,
    ReportesHistoricosComponent,
    NavbarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
