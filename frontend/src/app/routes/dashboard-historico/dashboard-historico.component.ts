import { Component, OnInit } from '@angular/core';
import { SafeUrlPipe } from "../../shared/pipes/safe-url.pipe";
import { CommonModule, NgClass } from '@angular/common';
import { PanelTitleComponent } from "../panel-title/panel-title.component";
import { CardRealTimeComponent } from "../../core/card-real-time/card-real-time.component";
import { DashboardPanelComponent } from "../../core/dashboard-panel/dashboard-panel.component";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserService } from '../../shared/services/user.service';
import { environment } from '../../../environments/environment.prod';

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


  constructor(private userService: UserService, private sanitizer: DomSanitizer) {}

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
      this.powerLastYearUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.powerLastYearUrl}${this.selectedDevice}`);
      this.voltageLastYearUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.voltageLastYearUrl}${this.selectedDevice}`);
      this.histEnergyMonthUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.histEnergyMonthUrl}${this.selectedDevice}`);
      this.histEnergyUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.histEnergyUrl}${this.selectedDevice}`);
    }
  }


}
