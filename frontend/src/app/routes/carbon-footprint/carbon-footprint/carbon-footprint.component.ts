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
   emissionsCO2: number;  // Propiedad para almacenar el total de CO2
   startDate: string | null = null;
   endDate: string | null = null;
   KwhToCO2Emissions : number | null = null;
   KwhToTreeCO2Absorption : number | null = null;
   KwhToVehicleEmissions : number | null = null;
   KwhToFlightEmissions : number | null = null;

  constructor(private measurementsService: MeasurementsService,
              private authService: AuthService,
              private carbonServ : CarbonService
            ) {
              this.emissionsCO2 = 0;
            }

ngOnInit(): void {
    this.getTotalCo2();
    this.KwhToCO2Emissions = this.convertKwhToCO2Emissions(this.emissionsCO2);
    this.KwhToTreeCO2Absorption= this.convertKwhToTreeCO2Absorption(this.KwhToCO2Emissions);
    this.KwhToVehicleEmissions = this.convertKwhToVehicleEmissions(this.KwhToCO2Emissions);
    this.KwhToFlightEmissions = this.convertKwhToFlightEmissions(this.KwhToCO2Emissions,false);
}

getTotalCo2(): void {

  const userId = this.authService.getUserId();
  const startTime = new Date('2024-10-01T00:00:00Z');
    const endTime = new Date('2024-11-01T00:00:00Z');
if (userId !== null) {
    this.carbonServ.getTotalKwh(userId, startTime, endTime)
      .subscribe(
        (data: TotalEnergy) => {
          this.emissionsCO2 = data.totalEnergy * this.carbonServ.emissionFactor;
          console.log('Total CO2:', this.emissionsCO2);
        },
        (error) => {
          console.error('Error al obtener el total de CO2:', error);
        }
      );
  } else {
    console.error('Error: Por favor selecciona ambas fechas y asegúrate de estar autenticado.');
  }
}

convertKwhToCO2Emissions(totalKwh: number): number{
  return this.KwhToCO2Emissions = totalKwh * this.carbonServ.emissionFactor;
}

//Un árbol absorbe aproximadamente 21 kg de CO₂ por año (según la FAO y otros estudios ambientales, aunque esto puede variar).

convertKwhToTreeCO2Absorption(totalKwh: number): number | null {
  try {
    this.KwhToCO2Emissions = this.convertKwhToCO2Emissions(totalKwh);
    if (this.KwhToCO2Emissions !== null) {
      this.KwhToTreeCO2Absorption = this.KwhToCO2Emissions / 20;
      console.log(this.KwhToTreeCO2Absorption)
      return this.KwhToTreeCO2Absorption;

    } else {
      throw new Error('Las emisiones de CO2 no están calculadas o son nulas.');
    }
  } catch (error) {
    console.error('Error al calcular la absorción de CO2 en árboles:', error);
    return null;
  }
}

//Un automóvil promedio emite 120 g de CO2 por kilómetro recorrido.

convertKwhToVehicleEmissions(totalKwh: number): number | null {
  try {
    this.KwhToCO2Emissions = this.convertKwhToCO2Emissions(totalKwh);

    if (this.KwhToCO2Emissions !== null) {
      // Suponiendo que un vehículo promedio emite 120g de CO2 por kilómetro
      const co2PerKilometer = 0.12;

      const vehicleEmissions = this.KwhToCO2Emissions / co2PerKilometer;

      return vehicleEmissions;
    } else {
      throw new Error('Las emisiones de CO2 no están calculadas o son nulas.');
    }
  } catch (error) {
    console.error('Error al calcular las emisiones equivalentes en vehículos:', error);
    return null;  // Devolver null en caso de error
  }
}

/* Un vuelo comercial emite aproximadamente 250 g de CO2 por pasajero-km en un vuelo de corta distancia
y puede llegar hasta 0.5 kg de CO2 por pasajero-km en vuelos largos. */

convertKwhToFlightEmissions(totalKwh: number, isLongDistance: boolean): number | null {
  try {
    this.KwhToCO2Emissions = this.convertKwhToCO2Emissions(totalKwh);

    if (this.KwhToCO2Emissions !== null) {
      // Definir las emisiones por pasajero-km según la distancia del vuelo
      const co2PerPassengerKm = isLongDistance ? 0.5 : 0.25;  // kg de CO2 por pasajero-km

      const flightEmissions = this.KwhToCO2Emissions / co2PerPassengerKm;

      return flightEmissions;
    } else {
      throw new Error('Las emisiones de CO2 no están calculadas o son nulas.');
    }
  } catch (error) {
    console.error('Error al calcular las emisiones equivalentes en vuelos:', error);
    return null;  // Devolver null en caso de error
  }
}
}
