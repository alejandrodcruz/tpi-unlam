import { Component } from '@angular/core';
import {SidebarComponent} from "../../../core/sidebar/sidebar.component";
import {ReportesHistoricosComponent} from "../../reportes/reportes-historicos/reportes-historicos.component";
import {CardInfoComponent} from "../../../core/card/card-info.component";
import {CommonModule, NgClass} from "@angular/common";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SidebarComponent,
    ReportesHistoricosComponent,
    CardInfoComponent,
    NgClass,
    CommonModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  isExpanded1: boolean = false;
  isExpanded2: boolean = false;
  isExpanded3: boolean = false;
  isExpanded4: boolean = false;

  toggleExpand(cardNumber: number) {
    switch (cardNumber) {
      case 1:
        this.isExpanded1 = !this.isExpanded1;
        break;
      case 2:
        this.isExpanded2 = !this.isExpanded2;
        break;
      case 3:
        this.isExpanded3 = !this.isExpanded3;
        break;
      case 4:
        this.isExpanded4 = !this.isExpanded4;
        break;
    }
  }
}
