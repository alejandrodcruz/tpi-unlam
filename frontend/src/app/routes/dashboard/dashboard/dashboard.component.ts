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

  constructor() { }

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
   // this.startTour();
  }


  startTour() {
    const intro = introJs();

    intro.setOptions({
      steps: [
        {
          intro: "Bienvenido al tutorial de la aplicación!"
        },
        {
          element: '#step1',
          intro: "Este es el primer paso."
        },
        {
          element: '#step2',
          intro: "Este es el segundo paso."
        },
        {
          element: '#step3',
          intro: "Este es el tercer paso."
        }
      ],
      showProgress: true,
      exitOnOverlayClick: false
    });

    intro.start();
  }
}
