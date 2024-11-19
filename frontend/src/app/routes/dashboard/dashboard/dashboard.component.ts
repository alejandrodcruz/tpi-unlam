import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../core/sidebar/sidebar.component";
import { ReportesHistoricosComponent } from "../../reportes/reportes-historicos/reportes-historicos.component";
import { CardInfoComponent } from "../../../core/card/card-info.component";
import { CommonModule, NgClass } from "@angular/common";
import {CardRealTimeComponent} from "../../../core/card-real-time/card-real-time.component";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {Device, UserService} from "../../../shared/services/user.service";
import {DashboardPanelComponent} from "../../../core/dashboard-panel/dashboard-panel.component";
import { Measurement, MeasurementsService } from '../../../shared/services/measurements.service';
import { AuthService } from '../../../shared/services/auth.service';
import { LoadingComponent } from '../../../core/loading/loading.component';
import { RouterLink } from '@angular/router';
import { environment } from '../../../../environments/environment.prod';
import { Subscription } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SidebarComponent,
    ReportesHistoricosComponent,
    CardInfoComponent,
    NgClass,
    CommonModule,
    CardRealTimeComponent,
    DashboardPanelComponent,
    LoadingComponent,
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  devices: Device[] = [];
  measurements: Measurement[] = [];
  public voltage: number | undefined;
  public current: number | undefined;
  public power: number | undefined;
  public energy: number | undefined;

  public selectedDevice: string = '';
  public hasDeviceId: boolean = false;
  public voltUrl: SafeResourceUrl | undefined;
  public ampUrl: SafeResourceUrl | undefined;
  public wattUrl: SafeResourceUrl | undefined;
  public kwhUrl: SafeResourceUrl | undefined;

  isLoading: boolean = false;
  private subscriptions: Subscription = new Subscription();

  constructor(private userService: UserService,
              private sanitizer: DomSanitizer,
              private measurementsService: MeasurementsService,
              private authService: AuthService,
              private toast: ToastrService) { }

  ngOnInit() {

    this.getMeasurements();

    this.userService.selectedDevice$.subscribe(device => {
      this.selectedDevice = device;
      if (this.selectedDevice) {
        this.hasDeviceId = true;
        this.updateIframeUrl();
      }
    });
    this.userService.getUserDevices().subscribe((devices) => {
      this.devices = devices;
    });
  }
  //select desde stat
  selectDevice(deviceId: string) {
    this.isLoading = true;
    this.selectedDevice = deviceId;
    this.userService.selectDevice(deviceId);
    this.measurementsService.setDeviceId(deviceId);

    setTimeout(() => {
      this.updateIframeUrl();
      this.isLoading = false;
    }, 4000);

    const selectedDeviceObj = this.devices.find(device => device.deviceId === deviceId);
    if (selectedDeviceObj) {
      this.userService.selectDeviceName(selectedDeviceObj.name);
    }
  }

  updateIframeUrl() {
    if (this.selectedDevice) {
      this.voltUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.voltUrl}${this.selectedDevice}`);
      this.ampUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.ampUrl}${this.selectedDevice}`);
      this.wattUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.wattUrl}${this.selectedDevice}`);
      this.kwhUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`${environment.kwhUrl}${this.selectedDevice}`);
    }
  }

  getMeasurements() {
    const userId = this.authService.getUserId();
    const fields = ['voltage', 'current', 'power', 'energy']; //campos espesificos
    const timeRange = '10s';

    if (userId !== null) {
      const measurementsSub = this.measurementsService.getUserMeasurementsRealTime(userId, fields, timeRange)
        .subscribe(
          (data) => {
            this.measurements = data;
            if (data.length > 0) {
              // Asignar los valores de las mediciones al componente
            this.voltage = parseFloat(data[0].voltage.toFixed(2));
            this.current = parseFloat(data[0].current.toFixed(2));
            this.power = parseFloat(data[0].power.toFixed(2));
            this.energy = parseFloat(data[0].energy.toFixed(2));
            }
          },
          (error) => {
            console.error('Error al obtener las mediciones', error);
          }
        );
        this.subscriptions.add(measurementsSub);
    } else {
      this.toast.warning("No cuentas con user activo.");
      this.authService.logout();
    }
  }

  ngOnDestroy() {
    // Destruir todas las suscripciones al destruir el componente
    this.subscriptions.unsubscribe();
  }
}
