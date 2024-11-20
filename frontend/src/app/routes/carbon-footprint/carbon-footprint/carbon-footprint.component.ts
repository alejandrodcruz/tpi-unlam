import { Component, OnInit } from '@angular/core';
import { CardInfoComponent } from '../../../core/card/card-info.component';
import { CommonModule } from '@angular/common';
import { PanelTitleComponent } from "../../panel-title/panel-title.component";
import { Measurement } from '../../../shared/services/measurements.service';
import { AuthService } from '../../../shared/services/auth.service';
import { CarbonService } from '../../../shared/services/carbon.service';
import { TotalEnergy } from '../models/totalEnergy.models';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../shared/services/user.service';
import {LoadingComponent} from "../../../core/loading/loading.component";

@Component({
  selector: 'app-carbon-footprint',
  standalone: true,
  imports: [CardInfoComponent, CommonModule, PanelTitleComponent, FormsModule, LoadingComponent],
  templateUrl: './carbon-footprint.component.html',
  styleUrl: './carbon-footprint.component.css'
})
export class CarbonFootprintComponent implements OnInit {
  measurements: Measurement[] = [];
  emissionsCO2: number; // Propiedad para almacenar el total de CO2
  startDate: string | null = null;
  endDate: string | null = null;
  KwhToCO2EmissionsCurrent: number = 0;
  KwhToTreeCO2AbsorptionCurrent: number = 0;
  KwhToVehicleEmissionsCurrent: number = 0;
  KwhToFlightEmissionsCurrent: number = 0;

  KwhToCO2EmissionsPrevious: number = 0;
  KwhToTreeCO2AbsorptionPrevious: number = 0;
  KwhToVehicleEmissionsPrevious: number = 0;
  KwhToFlightEmissionsPrevious: number = 0;

  currentDate = new Date();
  private destroy$ = new Subject<void>();
  selectedDevice: string = '';
  devices: any[] = [];
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private carbonServ: CarbonService,
    private userService: UserService,
    private toast: ToastrService
  ) {
    this.emissionsCO2 = 0;
  }

  ngOnInit(): void {
    this.getTotalCo2();

    // Suscribirse al dispositivo seleccionado
    this.userService.selectedDevice$.subscribe(device => {
      this.selectedDevice = device;
    });

    // Obtener dispositivos del usuario
    this.userService.getUserDevices().subscribe((devices) => {
      this.devices = devices;
    });
  }

  selectDevice(deviceId: string) {
    this.isLoading = true;
    this.selectedDevice = deviceId;
    this.userService.selectDevice(deviceId);

    setTimeout(() => {
      this.isLoading = false;
    }, 4000);
  }

  // Función para formatear fechas al formato ISO (yyyy-MM-ddTHH:mm:ssZ)
  formatDateToISO(date: Date): string {
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

  convertKwhToCO2Emissions(totalKwh: number): number {
    return totalKwh * this.carbonServ.emissionFactor;
  }

  convertKwhToTreeCO2Absorption(co2Emissions: number): number {
    const treesNeeded = co2Emissions / 21;
    return parseFloat(treesNeeded.toFixed(2));
  }

  convertKwhToVehicleEmissions(co2Emissions: number): number {
    const co2PerKilometer = 0.12;
    const vehicleEmissions = co2Emissions / co2PerKilometer;
    return parseFloat(vehicleEmissions.toFixed(2));
  }

  convertKwhToFlightEmissions(co2Emissions: number, isLongDistance: boolean): number {
    const co2PerPassengerKm = isLongDistance ? 0.5 : 0.25;
    const flightEmissions = co2Emissions / co2PerPassengerKm;
    return parseFloat(flightEmissions.toFixed(2));
  }
}
