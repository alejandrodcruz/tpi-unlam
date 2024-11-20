import { Component, OnInit } from '@angular/core';
import { CardInfoComponent } from '../../../core/card/card-info.component';
import { CommonModule } from '@angular/common';
import {PanelTitleComponent} from "../../panel-title/panel-title.component";
import { Measurement } from '../../../shared/services/measurements.service';
import { AuthService } from '../../../shared/services/auth.service';
import { CarbonService } from '../../../shared/services/carbon.service';
import { TotalEnergy } from '../models/totalEnergy.models';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

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
   KwhToCO2EmissionsCurrent : number  = 0;
   KwhToTreeCO2AbsorptionCurrent :number  = 0;
   KwhToVehicleEmissionsCurrent : number  = 0;
   KwhToFlightEmissionsCurrent : number  = 0;

   KwhToCO2EmissionsPrevious: number  = 0;
   KwhToTreeCO2AbsorptionPrevious :number  = 0;
   KwhToVehicleEmissionsPrevious : number  = 0;
   KwhToFlightEmissionsPrevious : number  = 0;

   currentDate = new Date();
   private destroy$ = new Subject<void>();


  constructor(
              private authService: AuthService,
              private carbonServ : CarbonService,
              private toast: ToastrService
            ) {
              this.emissionsCO2 = 0;
            }

ngOnInit(): void {
    this.getTotalCo2();
}
// Función para formatear fechas al formato ISO (yyyy-MM-ddTHH:mm:ssZ)
 formatDateToISO(date: Date): string {
  // Convertir la fecha a ISO, eliminar la parte de milisegundos y agregar la 'Z'
  return date.toISOString().split('.')[0] + 'Z';
}

// Obtener el primer día del mes actual
 getFirstDayOfCurrentMonth(): string {
  const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
  return this.formatDateToISO(date);
}

// Obtener el primer día del mes anterior
 getFirstDayOfPreviousMonth(): string {
  const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
  return this.formatDateToISO(date);
}

// Obtener el último día del mes anterior
getLastDayOfPreviousMonth(): string {
  const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 0); // Día 0 del mes actual es el último día del mes anterior
  return this.formatDateToISO(date);
}

ngOnDestroy(): void {
  // Emitir un valor para completar todas las suscripciones
  this.destroy$.next();
  this.destroy$.complete();
}

getTotalCo2(): void {
  const userId = this.authService.getUserId();

  // Fechas para el mes actual
  const FirstDayOfCurrentMonth = this.getFirstDayOfCurrentMonth();
  const startTimeCurrentMonth = new Date(FirstDayOfCurrentMonth);
  const endTimeCurrentMonth = new Date(); // Primer día del próximo mes

  // Fechas para el mes anterior
  const FirstDayOfPreviousMonth = this.getFirstDayOfPreviousMonth();
  const LastDayOfPreviousMonth = this.getLastDayOfPreviousMonth();
  const startTimePreviousMonth = new Date(FirstDayOfPreviousMonth);
  const endTimePreviousMonth = new Date(LastDayOfPreviousMonth);

  if (userId !== null) {
    // Obtener datos del mes actual
    this.carbonServ.getTotalKwhRealTime(userId, startTimeCurrentMonth)
    .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: TotalEnergy) => {
          const totalKwh = data.totalEnergy;
          this.emissionsCO2 = this.convertKwhToCO2Emissions(totalKwh);

          // Asignar emisiones y conversiones para el mes actual
          this.KwhToCO2EmissionsCurrent = parseFloat(this.emissionsCO2.toFixed(2));
          this.KwhToTreeCO2AbsorptionCurrent = this.convertKwhToTreeCO2Absorption(this.KwhToCO2EmissionsCurrent);
          this.KwhToVehicleEmissionsCurrent = this.convertKwhToVehicleEmissions(this.KwhToCO2EmissionsCurrent);
          this.KwhToFlightEmissionsCurrent = this.convertKwhToFlightEmissions(this.KwhToCO2EmissionsCurrent, false);
        },
        (error) => {
          console.error('Error al obtener el total de CO2:', error);
        }
      );

    // Obtener datos del mes anterior
    this.carbonServ.getTotalKwh(userId, startTimePreviousMonth, endTimePreviousMonth)
    .pipe(takeUntil(this.destroy$))
      .subscribe(
        (data: TotalEnergy) => {
          const totalKwhPrevious = data.totalEnergy;
          const emissionsCO2Previous = this.convertKwhToCO2Emissions(totalKwhPrevious);

          // Asignar emisiones y conversiones para el mes anterior
          this.KwhToCO2EmissionsPrevious = parseFloat(emissionsCO2Previous.toFixed(2));
          this.KwhToTreeCO2AbsorptionPrevious = this.convertKwhToTreeCO2Absorption(this.KwhToCO2EmissionsPrevious);
          this.KwhToVehicleEmissionsPrevious = this.convertKwhToVehicleEmissions(this.KwhToCO2EmissionsPrevious);
          this.KwhToFlightEmissionsPrevious = this.convertKwhToFlightEmissions(this.KwhToCO2EmissionsPrevious, false);

        },
        (error) => {
          console.error('Error al obtener el total de CO2 del mes anterior:', error);
        }
      );
  } else {
    this.toast.warning("No cuentas con un usuario activo.");
    this.authService.logout();
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
  return parseFloat(vehicleEmissions.toFixed(2));;
}

/* Un vuelo comercial emite aproximadamente 250 g de CO2 por pasajero-km en un vuelo de corta distancia
y puede llegar hasta 0.5 kg de CO2 por pasajero-km en vuelos largos. */

convertKwhToFlightEmissions(co2Emissions: number, isLongDistance: boolean): number {
  const co2PerPassengerKm = isLongDistance ? 0.5 : 0.25; // kg de CO2 por pasajero-km
  const flightEmissions = co2Emissions / co2PerPassengerKm;
  return parseFloat(flightEmissions.toFixed(2));;
}

}
