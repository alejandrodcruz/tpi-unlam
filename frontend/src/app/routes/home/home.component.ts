import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../core/sidebar/sidebar.component';
import { ToolbarComponent } from '../../core/toolbar/toolbar.component';
import { CommonModule } from '@angular/common';
import {AlertsComponent} from "../alerts/alerts.component";
import {AlertComponent} from "../../shared/alert/alert.component";
import { DevicePopupComponent } from '../../core/device-popup/device-popup.component';
import { AuthService, User } from '../../shared/services/auth.service';
import { DeviceService } from '../../shared/services/device.service';
import introJs from 'intro.js';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    SidebarComponent,
    ToolbarComponent,
    CommonModule,
    AlertsComponent,
    AlertComponent,
    DevicePopupComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isSidebarOpen = true;
  screenWidth: number = 1024;
  showPopup: boolean = false;

  constructor(private userService: AuthService, private deviceService: DeviceService) { }

  ngOnInit() {
    this.onResize();
    this.checkUserDevice();
  }

  checkUserDevice() {
    this.deviceService.getUserDevices().subscribe(
      {
        next: (devices) => {
          if (devices && devices.length > 0) {
            this.startTour();
          } else {
            this.openDevicePopup();
          }
        },
        error: (error) => {
          console.error('Error al obtener los dispositivos del usuario:', error);
          if (error.status === 404) {
            this.openDevicePopup();
          }
        }
      }
    );
  }

  openDevicePopup() {
    this.showPopup = true;
  }

  onPopupClose() {
    this.showPopup = false;
    this.checkUserDevice();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  onSidebarClosed() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (typeof window !== 'undefined') {
      this.screenWidth = window.innerWidth;
    }

    if (this.screenWidth < 1024) {
      this.isSidebarOpen = false;
    } else {
      this.isSidebarOpen = true;
    }
  }
  startTour() {
    const hasSeenTour = localStorage.getItem('hasSeenTour');

    if (!hasSeenTour) {
      const stepElements = ['step1', 'step2', 'step3', 'step4', 'step5', 'step6', 'step7', 'step8', 'step9'];
      const allElementsExist = stepElements.every(id => document.getElementById(id) !== null);

      if (allElementsExist) {
        const intro = introJs();

        intro.setOptions({
          nextLabel: 'Siguiente',
          prevLabel: 'Atrás',
          doneLabel: 'Finalizar',
          exitOnEsc: true,
          exitOnOverlayClick: false,
          showProgress: true,
          steps: [
            { intro: "👋 ¡Bienvenido al Dashboard de Lytics! Aquí puedes ver toda la información de consumo energético de tu hogar." },
            { element: '#step1', intro: "🕒 Reloj – Indica el horario actual en Buenos Aires." },
            { element: '#step2', intro: "💧 Humedad – Muestra el nivel actual de humedad relativa en el ambiente." },
            { element: '#step3', intro: "🌡️ Temperatura – Indica la temperatura ambiente en grados Celsius." },
            { element: '#step4', intro: "💵 Consumo Real – Visualiza el consumo eléctrico actual expresado en kilovatios-hora." },
            { element: '#step5', intro: "PANEL – Información en tiempo real proporcionada por tu dispositivo." },
            { element: '#step6', intro: "⚡ Voltaje – Visualiza la tensión eléctrica que llega a tus dispositivos." },
            { element: '#step7', intro: "🔌 Amperaje – Refleja la cantidad de corriente eléctrica fluyendo en el sistema." },
            { element: '#step8', intro: "💡 Watts – Indica el consumo instantáneo de energía, similar al combustible utilizado en tiempo real." },
            { element: '#step9', intro: "⚙️ Kilovatios-hora (kWh) – Mide el consumo acumulado de electricidad durante un período específico." },
            { element: '#step5', intro: "Ahora podés visualizar detalladamente tus consumos de energía en tiempo real." }
          ]
        });

        intro.start();

        intro.oncomplete(() => {
          localStorage.setItem('hasSeenTour', 'true');
        });

        intro.onexit(() => {
          localStorage.setItem('hasSeenTour', 'true');
        });
      } else {
        setTimeout(() => this.startTour(), 500);
      }
    }
  }
}
