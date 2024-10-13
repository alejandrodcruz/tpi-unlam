import { Component, OnInit } from '@angular/core';
import { SidebarComponent } from "../../../core/sidebar/sidebar.component";
import { ReportesHistoricosComponent } from "../../reportes/reportes-historicos/reportes-historicos.component";
import { CardInfoComponent } from "../../../core/card/card-info.component";
import { CommonModule, NgClass } from "@angular/common";
import introJs from 'intro.js';

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

