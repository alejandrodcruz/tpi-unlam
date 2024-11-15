import { Component, OnInit } from '@angular/core';
import { HistorialService } from "../../shared/services/historial.service";
import { SafeUrlPipe } from "../../shared/pipes/safe-url.pipe";
import { CommonModule, NgClass } from '@angular/common';
import { PanelTitleComponent } from "../panel-title/panel-title.component";
import { CardRealTimeComponent } from "../../core/card-real-time/card-real-time.component";
import { DashboardPanelComponent } from "../../core/dashboard-panel/dashboard-panel.component";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-dashboard-historico',
  templateUrl: './dashboard-historico.component.html',
  standalone: true,
  imports: [
    SafeUrlPipe,
    CommonModule,
    PanelTitleComponent, NgClass,
    CommonModule,
    CardRealTimeComponent, DashboardPanelComponent,
  ],
  styleUrls: ['./dashboard-historico.component.css']
})
export class DashboardHistoricoComponent implements OnInit {

  consumoMensual: string = '';
  public selectedDevice: string = '';
  powerLastYearUrl: SafeResourceUrl | undefined;
  voltageLastYearUrl: SafeResourceUrl | undefined;
  histEnergyMonthUrl: SafeResourceUrl | undefined;
  histEnergyUrl: SafeResourceUrl | undefined;


  constructor(private historialService: HistorialService,private userService: UserService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {

    this.userService.selectedDevice$.subscribe(device => {
      this.selectedDevice = device;
      if (this.selectedDevice) {
        this.updateIframeUrl();
      }
    });
  }

  updateIframeUrl() {
    if (this.selectedDevice) {
      const powerLastYearUrl = `http://localhost:3000/d-solo/ee1me0bqeal8gf/power-last-year?orgId=1&panelId=1&var-deviceId=${this.selectedDevice}&refresh=5s`;
      this.powerLastYearUrl = this.sanitizer.bypassSecurityTrustResourceUrl(powerLastYearUrl);
      const voltageLastYearUrl = `http://localhost:3000/d-solo/ae1mdiw2xsb28c/voltage-last-year?orgId=1&panelId=1&var-deviceId=${this.selectedDevice}&refresh=5s`;
      this.voltageLastYearUrl = this.sanitizer.bypassSecurityTrustResourceUrl(voltageLastYearUrl);
      const histEnergyMonthUrl = `http://localhost:3000/d-solo/fe1mcple571fkf/hist-energy-month?orgId=1&panelId=1&var-deviceId=${this.selectedDevice}&refresh=5s`;
      this.histEnergyMonthUrl = this.sanitizer.bypassSecurityTrustResourceUrl(histEnergyMonthUrl);
      const histEnergyUrl = `http://localhost:3000/d-solo/ae1m3p3ni09vke/hist-energy?orgId=1&panelId=1&var-deviceId=${this.selectedDevice}&refresh=5s`;
      this.histEnergyUrl = this.sanitizer.bypassSecurityTrustResourceUrl(histEnergyUrl);
    }
  }


}
