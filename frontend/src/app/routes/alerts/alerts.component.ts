import { Component, OnInit } from '@angular/core';
import { CardInfoComponent } from "../../core/card/card-info.component";
import { FormsModule } from "@angular/forms";
import { AlertsService } from "../../shared/services/alerts.service";
import { WebSocketService } from "../../shared/services/web-socket.service";
import { DatePipe, CommonModule } from "@angular/common";
import { PanelTitleComponent } from "../panel-title/panel-title.component";
import {UserService} from "../../shared/services/user.service";
import {ActivatedRoute} from "@angular/router";
import { Location } from '@angular/common';

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
  templateUrl: './alerts.component.html'
})
export class AlertsComponent implements OnInit {
  alerts: any[] = [];
  filteredAlerts: any[] = [];
  displayedAlerts: any[] = [];
  public deviceId: string = '';
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

  constructor(private userService: UserService,
              private alertService: AlertsService,
              private webSocketService: WebSocketService,
              private route: ActivatedRoute,
              private location: Location) {}

  ngOnInit(): void {
    this.userService.selectedDevice$.subscribe(device => {
      this.deviceId = device;
      this.loadAlerts();
    });

    this.webSocketService.listenTopic().subscribe(() => {
      this.loadAlerts();
    });
  }

  loadAlerts(): void {
    this.userService.selectedDevice$.subscribe(() => {
      this.deviceId = this.route.snapshot.paramMap.get('deviceId') || '';
    });


    this.alertService.getAlertsForDeviceId(this.deviceId)
        .subscribe((alerts) => {
          this.alerts = alerts;
          this.filteredAlerts = alerts;
          this.updatePagination();
        });
  }

  goBack(): void {
    this.location.back();
  }

  filterAlertsByType(type: string): void {
    if (type === 'All') {
      this.filteredAlerts = this.alerts;
    } else {
      this.filteredAlerts = this.alerts.filter(alert => alert.type === type);
    }
    this.currentPage = 1;
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
