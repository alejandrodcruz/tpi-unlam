import { Component } from '@angular/core';
import { ReportesService } from "../../shared/services/reportes.service";
import { SafeUrlPipe } from "../../shared/pipes/safe-url.pipe";
import { FormsModule } from "@angular/forms";
import { NgClass, NgIf } from "@angular/common";
import {PanelTitleComponent} from "../panel-title/panel-title.component";

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  standalone: true,
  imports: [
    SafeUrlPipe,
    FormsModule,
    NgClass,
    NgIf,
    PanelTitleComponent
  ],
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent {
  selectedType: string | null = null;
  startDate: string | null = null;
  endDate: string | null = null;
  graficoUrl: string | null = null;
  errorMessage: string | null = null;

  constructor(private reportesService: ReportesService) {}

  setSelectedType(type: string): void {
    this.selectedType = type;
    this.graficoUrl = '';
    this.errorMessage = null;
  }

  generateGraficoUrl(): void {
    if (!this.selectedType || !this.startDate || !this.endDate) {
      this.errorMessage = "Por favor, selecciona un tipo de gráfico y un rango de fechas antes de buscar.";
      return;
    }

    this.reportesService.getGraficoUrl(this.selectedType, this.startDate, this.endDate)
      .subscribe(
        (url: string) => {
          if (url.startsWith('Error')) {
            this.errorMessage = url;
          } else {
            this.graficoUrl = url;
            this.errorMessage = null;
          }
        },
        (error) => {
          this.errorMessage = 'Error al obtener la URL del gráfico: ' + error;
        }
      );
  }
}





















/*
import { Component } from '@angular/core';
import { SidebarComponent } from "../../core/sidebar/sidebar.component";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatInputModule } from "@angular/material/input";
import { MAT_DATE_LOCALE, MatNativeDateModule } from "@angular/material/core";
import { NgClass, NgIf } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { ReportesService } from "../../shared/services/reportes.service";
import { SafeUrlPipe } from '../../shared/pipes/safe-url.pipe';
import {PanelTitleComponent} from "../panel-title/panel-title.component";

registerLocaleData(localeEs);

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    SidebarComponent,
    MatDatepickerModule,
    MatInputModule,
    MatNativeDateModule,
    FormsModule,
    NgIf,
    SafeUrlPipe,
    PanelTitleComponent
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
  ],
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent {

  constructor(private reportesService: ReportesService) {
  }

  startDate: Date | null = null;
  endDate: Date | null = null;
  dateError: string = '';
  graficoUrl: string = '';

  ngOnInit(): void{
    this.graficoUrl = this.reportesService.getGrafico();
  }

  onDateChange() {
    const today = new Date();

    if (this.startDate && this.startDate > today) {
      this.dateError = 'La fecha de inicio no puede ser una fecha futura.';
    } else if (this.endDate && this.endDate > today) {
      this.dateError = 'La fecha de finalización no puede ser una fecha futura.';
    } else {
      if (this.startDate && this.endDate) {
        if (this.startDate > this.endDate) {
          this.dateError = 'La fecha de inicio no puede ser posterior a la fecha de finalización.';
        } else if (this.endDate < this.startDate) {
          this.dateError = 'La fecha de finalización no puede ser anterior a la fecha de inicio.';
        } else {
          this.dateError = '';
        }
      }
    }
  }

  isConsumoSelected: boolean = false;
  isAmperajeSelected: boolean = false;
  isPotenciaSelected: boolean = false;
  isFrecuenciaSelected: boolean = false;

  toggleSelection(type: string) {
    this.isConsumoSelected = false;
    this.isAmperajeSelected = false;
    this.isPotenciaSelected = false;
    this.isFrecuenciaSelected = false;

    switch (type) {
      case 'consumo':
        this.isConsumoSelected = true;
        break;
      case 'amperaje':
        this.isAmperajeSelected = true;
        break;
      case 'potencia':
        this.isPotenciaSelected = true;
        break;
      case 'frecuencia':
        this.isFrecuenciaSelected = true;
        break;
    }
  }
}

*/

/*
import { Component } from '@angular/core';
import {SidebarComponent} from "../../core/sidebar/sidebar.component";
import {FontAwesomeModule} from "@fortawesome/angular-fontawesome";

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    SidebarComponent,
    FontAwesomeModule
  ],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent {

}
*/
