import { Component, OnInit } from '@angular/core';
import { CardInfoComponent } from '../../../core/card/card-info.component';
import { CommonModule } from '@angular/common';
import {PanelTitleComponent} from "../../panel-title/panel-title.component";
import { Measurement, MeasurementsService } from '../../../shared/services/measurements.service';
import { AuthService } from '../../../shared/services/auth.service';

@Component({
  selector: 'app-carbon-footprint',
  standalone: true,
  imports: [CardInfoComponent, CommonModule, PanelTitleComponent],
  templateUrl: './carbon-footprint.component.html',
  styleUrl: './carbon-footprint.component.css'
})
export class CarbonFootprintComponent implements OnInit{
  measurements: Measurement[] = [];

  constructor(private measurementsService: MeasurementsService,
              private authService: AuthService) {}

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
}
