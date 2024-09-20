import { Component } from '@angular/core';
import {SidebarComponent} from "../../sidebar/sidebar.component";
import {ReportesHistoricosComponent} from "../../reportes/reportes-historicos/reportes-historicos.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
    imports: [
        SidebarComponent,
        ReportesHistoricosComponent
    ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}