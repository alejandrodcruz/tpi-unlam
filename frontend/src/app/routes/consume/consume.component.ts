import { Component, OnInit } from '@angular/core';
import { CardInfoComponent } from "../../core/card/card-info.component";
import { FormsModule } from "@angular/forms";
import { DatePipe, CommonModule } from "@angular/common";
import { PanelTitleComponent } from "../panel-title/panel-title.component";
import {CardRealTimeComponent} from "../../core/card-real-time/card-real-time.component";
import { Device, UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { ConsumptionService } from '../../shared/services/consumption.service';
import { forkJoin, Subject, takeUntil } from 'rxjs';



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
  templateUrl: './consume.component.html'
})
export class ConsumeComponent implements OnInit {
  devices: Device[] = [];
  userId: number;
  private destroy$ = new Subject<void>();

  constructor(private userService: UserService, private authService: AuthService,
    private consumptionService: ConsumptionService)
    {
    this.userId = this.authService.getUserId() ?? 0;
    }

    ngOnInit(): void {
      this.userService.getUserDevices().pipe(takeUntil(this.destroy$)).subscribe((devices) => {
        this.devices = devices;
        this.devices.forEach(device => {
          const lastDay$ = this.consumptionService.getLastDayConsumption(this.userId, device.deviceId);
          const currentMonth$ = this.consumptionService.getCurrentMonthConsumption(this.userId, device.deviceId);
          const previousMonth$ = this.consumptionService.getPreviousMonthConsumption(this.userId, device.deviceId);
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
          });
        });
      });
    }

    ngOnDestroy(): void {
      // Emite un valor para completar todas las suscripciones que observan `destroy$`
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
  }
