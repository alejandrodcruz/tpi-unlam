import { Component, OnInit, OnDestroy, LOCALE_ID } from '@angular/core';
import { CardInfoComponent } from "../../core/card/card-info.component";
import { FormsModule } from "@angular/forms";
import { DatePipe, CommonModule, registerLocaleData } from "@angular/common";
import { PanelTitleComponent } from "../panel-title/panel-title.component";
import { CardRealTimeComponent } from "../../core/card-real-time/card-real-time.component";
import { Device, UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { ConsumptionService } from '../../shared/services/consumption.service';
import { forkJoin, Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);
@Component({
  selector: 'consume',
  standalone: true,
  imports: [
    CommonModule,
    CardInfoComponent,
    FormsModule,
    DatePipe,
    PanelTitleComponent,
    CardRealTimeComponent
  ],
  templateUrl: './consume.component.html',
  providers: [DatePipe, { provide: LOCALE_ID, useValue: 'es-ES' } ]
})
export class ConsumeComponent implements OnInit, OnDestroy {
  devices: Device[] = [];
  userId: number;
  private destroy$ = new Subject<void>();
  totalCurrentMonthConsumption: number = 0;

  // Nuevas propiedades para la selección de mes
  selectedMonth: string = ''; // Formato 'YYYY-MM'
  showModal: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private consumptionService: ConsumptionService,
    private datePipe: DatePipe
  ) {
    this.userId = this.authService.getUserId() ?? 0;
  }

  ngOnInit(): void {
    this.userService.getUserDevices().pipe(takeUntil(this.destroy$)).subscribe((devices) => {
      this.devices = devices;
      this.loadDeviceConsumptions();
    });
  }
  totalComparisonSavings: number = 0;
  loadDeviceConsumptions(): void {
    this.devices.forEach(device => {
      const lastDay$ = this.consumptionService.getLastDayConsumption(this.userId, device.deviceId);
      const currentMonth$ = this.consumptionService.getCurrentMonthConsumption(this.userId, device.deviceId);
      const previousMonth$ = this.getPreviousMonthObservable(device.deviceId);
      const projectedCurrentMonth$ = this.consumptionService.getProjectedCurrentMonthConsumption(this.userId, device.deviceId);

      forkJoin({
        lastDayConsumption: lastDay$,
        currentMonthConsumption: currentMonth$,
        previousMonthConsumption: previousMonth$,
        projectedCurrentMonthConsumption: projectedCurrentMonth$
      }).pipe(takeUntil(this.destroy$)).subscribe(({ lastDayConsumption, currentMonthConsumption, previousMonthConsumption, projectedCurrentMonthConsumption }) => {
        device.lastDayConsumption = parseFloat(lastDayConsumption.toFixed(2));
        device.currentMonthConsumption = parseFloat(currentMonthConsumption.toFixed(2));
        device.previousMonthConsumption = parseFloat(previousMonthConsumption.toFixed(2));
        device.projectedCurrentMonthConsumption = parseFloat(projectedCurrentMonthConsumption.toFixed(2));

        // Cálculo de la diferencia y porcentaje
        const previous = device.previousMonthConsumption || 0;
        const projected = device.projectedCurrentMonthConsumption || 0;

        if (previous > 0) {
          const difference = projected - previous;
          const percentageDifference = (difference / previous) * 100;
          device.savingsPercentage = parseFloat(percentageDifference.toFixed(2));
          device.isSaving = difference < 0;
          device.monetaryDifference = parseFloat(difference.toFixed(2));
        } else {
          device.savingsPercentage = undefined;
          device.isSaving = undefined;
          device.monetaryDifference = undefined;
        }
        this.calculateTotalCurrentMonthConsumption();
        this.calculateTotalComparisonSavings();
      });
    });
  }

  getPreviousMonthObservable(deviceId: string): Observable<number> {
    if (this.selectedMonth) {
      const [year, month] = this.selectedMonth.split('-').map(num => parseInt(num, 10));
      return this.consumptionService.getMonthConsumption(this.userId, deviceId, month, year);
    } else {
      // Si no se ha seleccionado ningún mes, usar el mes anterior por defecto
      const today = new Date();
      const previousMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const month = previousMonthDate.getMonth() + 1;
      const year = previousMonthDate.getFullYear();
      return this.consumptionService.getMonthConsumption(this.userId, deviceId, month, year);
    }
  }

  openModal(): void {
    this.showModal = true;
  }

   onMonthSelected(selectedMonth: string): void {
    if (!selectedMonth) {return;}
    const selectedDate = new Date(selectedMonth + '-01');
    const today = new Date();

    if (selectedDate > today) {
      alert('No puedes seleccionar un mes futuro.');
      return;
    }
    this.selectedMonth = selectedMonth;
    this.showModal = false;
    this.loadDeviceConsumptions();
  }

  calculateTotalCurrentMonthConsumption(): void {
    this.totalCurrentMonthConsumption = this.devices.reduce((total, device) => {
      return total + (device.currentMonthConsumption || 0);
    }, 0);
  }

  calculateTotalComparisonSavings(): void {
    this.totalComparisonSavings = this.devices.reduce((total, device) => {
      return total + (device.monetaryDifference || 0);
    }, 0);
  }

  ngOnDestroy(): void {
    // Emite un valor para completar todas las suscripciones que observan destroy$
    this.destroy$.next();
    this.destroy$.complete();
  }

  getAbsoluteValue(value: number | undefined): number {
    return value !== undefined ? Math.abs(value) : 0;
  }

  getProgressValue(device: Device): number {
    if (device.savingsPercentage !== undefined) {
      const percentage = Math.abs(device.savingsPercentage);
      return percentage > 100 ? 100 : percentage;
    }
    return 0;
  }

  get previousMonthTitle(): string {
    if (this.selectedMonth) {
      const [year, month] = this.selectedMonth.split('-').map(num => parseInt(num, 10));
      const date = new Date(year, month - 1, 1); // Correctamente 0-basado
      console.log('Fecha para el título:', date);
      const monthName = this.datePipe.transform(date, 'MMMM'); // Usa 'es-ES' por LOCALE_ID
      if (monthName) {
        // Capitalizar la primera letra
        const capitalizedMonthName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
        return 'Mes de ' + capitalizedMonthName;
      }
    }
    return 'Mes Anterior';
  }

}
