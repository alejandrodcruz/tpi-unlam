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
   KwhToCO2Emissions : number  = 0;
   KwhToTreeCO2Absorption :number  = 0;
   KwhToVehicleEmissions : number  = 0;
   KwhToFlightEmissions : number  = 0;



  constructor(
              private authService: AuthService,
              private carbonServ : CarbonService
            ) {
              this.emissionsCO2 = 0;
            }

ngOnInit(): void {
    this.getTotalCo2();

}

getTotalCo2(): void {

  const userId = this.authService.getUserId();
  const startTime = new Date('2024-10-01T00:00:00Z');
    const endTime = new Date('2024-11-01T00:00:00Z');
if (userId !== null) {
    this.carbonServ.getTotalKwh(userId, startTime, endTime)
      .subscribe(
        (data: TotalEnergy) => {
          const totalKwh = data.totalEnergy;
          this.emissionsCO2 = this.convertKwhToCO2Emissions(totalKwh);
          console.log('Total CO2:', this.emissionsCO2);

          this.KwhToCO2Emissions = parseFloat(this.emissionsCO2.toFixed(2));
            console.log("Emisiones CO2 convertidas:", this.KwhToCO2Emissions);

            this.KwhToTreeCO2Absorption = this.convertKwhToTreeCO2Absorption(this.KwhToCO2Emissions);
            this.KwhToVehicleEmissions = this.convertKwhToVehicleEmissions(this.KwhToCO2Emissions);
            this.KwhToFlightEmissions = this.convertKwhToFlightEmissions(this.KwhToCO2Emissions, false);
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
  return totalKwh * this.carbonServ.emissionFactor;
}
//Un árbol absorbe aproximadamente 21 kg de CO₂ por año (según la FAO y otros estudios ambientales, aunque esto puede variar).
convertKwhToTreeCO2Absorption(co2Emissions: number): number {
  const treesNeeded = co2Emissions / 21; // 21 kg de CO₂ absorbidos por árbol al año
  return parseFloat(treesNeeded.toFixed(2));
}

//Un automóvil promedio emite 120 g de CO2 por kilómetro recorrido.

convertKwhToVehicleEmissions(co2Emissions: number): number {
  const co2PerKilometer = 0.12; // 120g de CO2 por kilómetro en kg
  const vehicleEmissions = co2Emissions / co2PerKilometer;
  return parseFloat(vehicleEmissions.toFixed(2));
}

/* Un vuelo comercial emite aproximadamente 250 g de CO2 por pasajero-km en un vuelo de corta distancia
y puede llegar hasta 0.5 kg de CO2 por pasajero-km en vuelos largos. */

convertKwhToFlightEmissions(co2Emissions: number, isLongDistance: boolean): number {
  const co2PerPassengerKm = isLongDistance ? 0.5 : 0.25; // kg de CO2 por pasajero-km
  const flightEmissions = co2Emissions / co2PerPassengerKm;
  return parseFloat(flightEmissions.toFixed(2));
}

}
