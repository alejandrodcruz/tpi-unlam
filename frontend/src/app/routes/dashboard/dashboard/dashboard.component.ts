import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../core/sidebar/sidebar.component";
import { ReportesHistoricosComponent } from "../../reportes/reportes-historicos/reportes-historicos.component";
import { CardInfoComponent } from "../../../core/card/card-info.component";
import { CommonModule, NgClass } from "@angular/common";
import introJs from 'intro.js';
import {CardRealTimeComponent} from "../../../core/card-real-time/card-real-time.component";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    SidebarComponent,
    ReportesHistoricosComponent,
    CardInfoComponent,
    NgClass,
    CommonModule,
    CardRealTimeComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'] // Asegúrate de que sea 'styleUrls' (plural) en lugar de 'styleUrl'
})
export class DashboardComponent implements OnInit { // Implementa OnInit
  isExpanded1: boolean = false;
  isExpanded2: boolean = false;
  isExpanded3: boolean = false;
  isExpanded4: boolean = false;

  constructor() {
  }

  // Método para manejar la expansión de tarjetas
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


  ngOnInit() {
    const hasDevice = localStorage.getItem('hasDevice');
   if(hasDevice === 'true') {
    this.startTour();}
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
}

