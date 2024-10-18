// alerts.component.ts
import { Component } from '@angular/core';
import { CardInfoComponent } from "../../core/card/card-info.component";
import { FormsModule } from "@angular/forms";
import { AlertsService } from "../../shared/services/alerts.service";
import { DatePipe, CommonModule } from "@angular/common";
import {PanelTitleComponent} from "../panel-title/panel-title.component";

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [
    CommonModule,
    CardInfoComponent,
    FormsModule,
    DatePipe,
    PanelTitleComponent,
  ],
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.css']  // Cambié 'styleUrl' a 'styleUrls' para evitar error.
})
export class AlertsComponent {
  alerts: any[] = [];
  filteredAlerts: any[] = [];
  displayedAlerts: any[] = [];
  deviceId: string = '08:A6:F7:24:71:98';
  alertTypes = [
    { key: 'HighConsumption', label: 'Consumo Alto' },
    { key: 'HighTension', label: 'Tensión Alta' },
    { key: 'LowTension', label: 'Tensión Baja' },
    { key: 'EnergyLoss', label: 'Pérdida de Energía' },
    { key: 'PeakPowerCurrent', label: 'Pico de Potencia' },
    { key: 'HighTemperature', label: 'Temperatura Alta' },
    { key: 'HighHumidity', label: 'Humedad Alta' },
    { key: 'LostDevice', label: 'Dispositivo Perdido' },
  ];

  pageSize = 12;
  currentPage = 1;
  totalPages = 1;

  constructor(private alertService: AlertsService) {}

  ngOnInit(): void {
    this.loadAlerts();
  }

  loadAlerts(): void {
    this.alertService.getAlertsForDeviceId(this.deviceId)
      .subscribe((alerts) => {
        this.alerts = alerts;
        this.filteredAlerts = alerts;
        this.updatePagination();
      });
  }

  filterAlertsByType(type: string): void {
    if (type === 'All') {
      this.filteredAlerts = this.alerts;
    } else {
      this.filteredAlerts = this.alerts.filter(alert => alert.type === type);
    }
    this.currentPage = 1;  // Reiniciar a la primera página después de filtrar
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(this.filteredAlerts.length / this.pageSize);
    this.displayedAlerts = this.filteredAlerts.slice((this.currentPage - 1) * this.pageSize, this.currentPage * this.pageSize);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }
}
