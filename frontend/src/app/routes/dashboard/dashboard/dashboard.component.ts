import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../core/sidebar/sidebar.component";
import { ReportesHistoricosComponent } from "../../reportes/reportes-historicos/reportes-historicos.component";
import { CardInfoComponent } from "../../../core/card/card-info.component";
import { CommonModule, NgClass } from "@angular/common";
// @ts-ignore
import introJs from 'intro.js';
import {CardRealTimeComponent} from "../../../core/card-real-time/card-real-time.component";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import {UserService} from "../../../shared/services/user.service";
import {DashboardPanelComponent} from "../../../core/dashboard-panel/dashboard-panel.component";
import { Measurement, MeasurementsService } from '../../../shared/services/measurements.service';
import { AuthService } from '../../../shared/services/auth.service';

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
    DashboardPanelComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

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

  constructor(private userService: UserService, private sanitizer: DomSanitizer,
              private measurementsService: MeasurementsService,
              private authService: AuthService) { }

  ngOnInit() {

    this.getMeasurements();

    const hasDevice = localStorage.getItem('hasDevice');
    if (hasDevice === 'true') {
      this.startTour();
    }

    this.userService.selectedDevice$.subscribe(device => {
      this.selectedDevice = device;
      if (this.selectedDevice) {
        this.hasDeviceId = true;
        this.updateIframeUrl();
      }
    });
  }

  updateIframeUrl() {
    if (this.selectedDevice) {
      const voltUrl = `http://localhost:3000/d-solo/ee09ykb533ncwf/voltage?orgId=1&panelId=1&var-deviceId=${this.selectedDevice}&refresh=5s`;
      this.voltUrl = this.sanitizer.bypassSecurityTrustResourceUrl(voltUrl);
      const ampUrl = `http://localhost:3000/d-solo/de09ym86tk2rkf/current?orgId=1&panelId=1&var-deviceId=${this.selectedDevice}&refresh=5s`;
      this.ampUrl = this.sanitizer.bypassSecurityTrustResourceUrl(ampUrl);
      const wattUrl = `http://localhost:3000/d-solo/ae09ynm4xgrggd/power?orgId=1&panelId=1&var-deviceId=${this.selectedDevice}&refresh=5s`;
      this.wattUrl = this.sanitizer.bypassSecurityTrustResourceUrl(wattUrl);
      const kwhUrl = `http://localhost:3000/d-solo/fe09yozs0bl6od/energy?orgId=1&panelId=1&var-deviceId=${this.selectedDevice}&refresh=5s`;
      this.kwhUrl = this.sanitizer.bypassSecurityTrustResourceUrl(kwhUrl);
    }
  }

  startTour() {
    const hasSeenTour = localStorage.getItem('hasSeenTour');

    if (!hasSeenTour) {
      const intro = introJs();
      intro.setOptions({
        nextLabel: 'Siguiente',
        prevLabel: 'Atrás',
        doneLabel: 'Finalizar',
        exitOnEsc: true,
        exitOnOverlayClick: false
      });

      intro.start();

      intro.setOptions({
        steps: [
          {intro: "👋 ¡Bienvenido al Dashboard de Lytics! Aquí puedes ver toda la información de consumo energético de tu hogar."
          },
          {element: '#step1', intro: "🕒 Reloj – Indica el horario actual en Buenos Aires."},
          {element: '#step2', intro: "💧 Humedad – Muestra el nivel actual de humedad relativa en el ambiente."},
          {element: '#step3', intro: "🌡️ Temperatura – Indica la temperatura ambiente en grados Celsius."},
          {element: '#step4', intro: "💵 Consumo Real – Visualiza el consumo eléctrico actual expresado en kilovatios-hora."},
          {element: '#step5', intro: "PANEL – Información en tiempo real proporcionada por tu dispositivo."},
          {element: '#step6', intro: "⚡ Voltaje – Visualiza la tensión eléctrica que llega a tus dispositivos."},
          {element: '#step7', intro: "🔌 Amperaje – Refleja la cantidad de corriente eléctrica fluyendo en el sistema.\n"},
          {element: '#step8', intro: "💡 Watts – Indica el consumo instantáneo de energía, similar al combustible utilizado en tiempo real."},
          {element: '#step9', intro: "⚙️ Kilovatios-hora (kWh) – Mide el consumo acumulado de electricidad durante un período específico."},
          {element: '#step5', intro: "Ahora podés visualizar detalladamente tus consumos de energía en tiempo real."}

        ],
        showProgress: true,
        exitOnOverlayClick: false
      });

      intro.start();

      intro.oncomplete(() => {
        localStorage.setItem('hasSeenTour', 'true');
      });

      intro.onexit(() => {
        localStorage.setItem('hasSeenTour', 'true');
      });
    }
  }
  getMeasurements() {
    const userId = this.authService.getUserId();
    const fields = ['voltage', 'current', 'power', 'energy']; //campos espesificos
    const timeRange = '10s';

    if (userId !== null) {
      this.measurementsService.getUserMeasurementsRealTime(userId, fields, timeRange)
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
    } else {
      console.error('Error: El usuario no está autenticado o el ID de usuario no es válido.');
    }
  }
}
