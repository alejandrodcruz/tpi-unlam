import { Component, OnInit } from '@angular/core';
import { CardInfoComponent } from '../../../core/card/card-info.component';
import { CommonModule } from '@angular/common';
import {PanelTitleComponent} from "../../panel-title/panel-title.component";
import { Measurement, MeasurementsService } from '../../../shared/services/measurements.service';
import { AuthService } from '../../../shared/services/auth.service';
import { CarbonService } from '../../../shared/services/carbon.service';
import { TotalEnergy } from '../models/totalEnergy.models';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-carbon-footprint',
  standalone: true,
  imports: [CardInfoComponent, CommonModule, PanelTitleComponent,FormsModule],
  templateUrl: './carbon-footprint.component.html',
  styleUrl: './carbon-footprint.component.css'
})
export class CarbonFootprintComponent implements OnInit{
  measurements: Measurement[] = [];

  totalCO2: number | null = null;  // Propiedad para almacenar el total de CO2

   // Propiedades para almacenar las fechas seleccionadas
   startDate: string | null = null;
   endDate: string | null = null;
 




  constructor(private measurementsService: MeasurementsService,
              private authService: AuthService,
              private carbonServ : CarbonService
            ) {
            
            }

ngOnInit(): void {
    this.getMeasurements();
 
}

getMeasurements(): void {
    const userId = this.authService.getUserId();
    const fields = ['voltage', 'current', 'power','energy','temperature', 'humidity', 'timestamp'];
    const timeRange = '10s';  // Ejemplo de rango de tiempo

    if (userId !== null) {
      this.measurementsService.getUserMeasurements(userId, fields, timeRange)
        .subscribe(
          (data) => {
            this.measurements = data;
            console.log('Mediciones obtenidas Huella:', this.measurements);

          },
          (error) => {
            console.error('Error al obtener las mediciones', error);
          }
        );
    } else {
      console.error('Error: El usuario no está autenticado o el ID de usuario no es válido.');
    }
  }

onDateChange(): void {
  const userId = this.authService.getUserId();

  // Validar que las fechas estén seleccionadas y el usuario esté autenticado
  if (userId !== null && this.startDate && this.endDate) {
    const startTime = new Date(this.startDate);
    const endTime = new Date(this.endDate);

    this.carbonServ.getCO2ForKwh(userId, startTime, endTime)
      .subscribe(
        (data: TotalEnergy) => {
          this.totalCO2 = data.totalEnergy * this.carbonServ.cO2Kwh;  // Calcular el CO2 total
          console.log('Total CO2:', this.totalCO2);
        },
        (error) => {
          console.error('Error al obtener el total de CO2:', error);
        }
      );
  } else {
    console.error('Error: Por favor selecciona ambas fechas y asegúrate de estar autenticado.');
  }
}



}
