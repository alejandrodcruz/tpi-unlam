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
      (devices) => {
        if (devices && devices.length > 0) {
          // El usuario tiene dispositivos asociados
          localStorage.setItem('hasDevice', 'true')
          this.startTour();
          console.log('El usuario tiene dispositivos:', devices);

        } else {
          // El usuario no tiene dispositivos asociados
          console.log('El usuario no tiene dispositivos.');
          this.openDevicePopup();
        }
      },
      (error) => {
        console.error('Error al obtener los dispositivos del usuario:', error);
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
          {element: '#step1', intro: "🕒 Reloj - Este es el horario actual en Buenos Aires."},
          {element: '#step2', intro: "💧 Humedad - Aquí se muestra la humedad relativa actual."},
          {element: '#step3', intro: "🌡️ Temperatura - La temperatura en grados Celsius."},
          {element: '#step4', intro: "💵 Consumo Real - El gasto actual en consumo eléctrico."},
          {element: '#step5', intro: "DATOS EN VIVO - DEL DISPOSITIVO"},
          {element: '#step6', intro: "⚡ Voltaje- El voltaje de la corriente alterna."},
          {element: '#step7', intro: "🔌 Amperaje - Indica cuánta electricidad está fluyendo por el sistema."},
          {element: '#step8', intro: "💡 Watts - Indica cuánta energía estás usando."},
          {element: '#step9', intro: "⚙️ Kilovatios-hora (kWh) - La cantidad de electricidad que usas en un período."},
          {element: '#step5', intro: "Ya puede visualizar tus consumos"}

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
}
