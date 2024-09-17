import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {CurrencyPipe, NgForOf} from "@angular/common";

@Component({
  selector: 'app-reportes-historicos',
  standalone: true,
  imports: [
    FormsModule,
    CurrencyPipe,
    NgForOf
  ],
  templateUrl: './reportes-historicos.component.html',
  styleUrl: './reportes-historicos.component.css'
})
export class ReportesHistoricosComponent {
  startDate: string = '';
  endDate: string = '';

  // Datos hardcodeados de consumos
  consumos = [
    { dia: '2024-09-10', consumo: 25, total: 500 },
    { dia: '2024-09-11', consumo: 30, total: 600 },
    { dia: '2024-09-12', consumo: 45, total: 900 },
    { dia: '2024-09-13', consumo: 35, total: 700 },
  ];

  // Lista filtrada
  filteredData = [...this.consumos];

  // Función para filtrar por fechas
  filterByDate() {
    if (this.startDate && this.endDate) {
      this.filteredData = this.consumos.filter(consumo => {
        const date = new Date(consumo.dia);
        return date >= new Date(this.startDate) && date <= new Date(this.endDate);
      });
    } else {
      this.filteredData = [...this.consumos];
    }
  }
}
