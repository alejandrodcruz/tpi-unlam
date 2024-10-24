import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { CurrenttimeService } from '../../shared/services/currenttime.service';
import {DatePipe, NgClass, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import { Measurement, MeasurementsService } from '../../shared/services/measurements.service';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { CarbonService } from '../../shared/services/carbon.service';
import { TotalEnergy } from '../../routes/carbon-footprint/models/totalEnergy.models';
@Component({
  selector: 'app-card-real-time',
  standalone: true,
  imports: [
    NgClass,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault,
    DatePipe,
    NgIf
  ],
  templateUrl: './card-real-time.component.html',
  styleUrl: './card-real-time.component.css'
})
export class CardRealTimeComponent implements OnInit, OnDestroy {

  measurements: Measurement[] = [];
  horaActual!: Date;
  private horaSubscription!: Subscription;
  private measurementsServiceSubscription!: Subscription;
  currentDate = new Date();

  @Input() iconClasses: string = '';
  @Input() titleCard: string = '';
  @Input() dataCardProgress: number = 0;
  @Input() subtitleCard: string = '';
  @Input() valueProgress: number = 10;
  @Input() maxProgress: number = 100;
  @Input() colorProgress: string = '';
  @Input() percentageClass: string = '';
  @Input() temperature: number = 0;
  @Input() currenTime: string = 'Cargando...';
  @Input() humidity: number = 0;
  @Input() consumo: number = 0;
  public tipoDato: string="";
  public totalEnergy: any;

  constructor(
              private measurementsService: MeasurementsService,
              private authService: AuthService,
              private currenttimeService: CurrenttimeService,
              private carbonService: CarbonService) {}

  ngOnInit(): void {

    this.getMeasurements();

    if (this.titleCard === 'Horario') {
      this.tipoDato = 'horaActual';
      this.getHoraActual();
    }

    if (this.titleCard === 'Consumo') {
      this.tipoDato = 'energy';
      this.getkwh();
    }


  }

  getMeasurements() {
    const userId = this.authService.getUserId();
    const fields = ['humidity', 'temperature', 'timestamp', 'energy']; //campos espesificos
    const timeRange = '10s';

    if (userId !== null) {
      this.measurementsServiceSubscription = this.measurementsService.getUserMeasurementsRealTime(userId, fields, timeRange)
        .subscribe(
          (data) => {
            this.measurements = data;
            if (this.measurements.length > 0) {
              const firstMeasurement = this.measurements[0];

              // Asignación de tipoDato según el título de la tarjeta
              if (this.titleCard === 'Humedad') {
                this.humidity = firstMeasurement.humidity;
                this.dataCardProgress = firstMeasurement.humidity;
                this.tipoDato = 'humidity';
              }

              if (this.titleCard === 'Temperatura') {
                this.temperature = firstMeasurement.temperature;
                this.dataCardProgress = firstMeasurement.temperature;
                this.tipoDato = 'temperature';
              }
            }

          },
          (error) => {
            console.error('Error al obtener las mediciones', error);
          }
        );
    } else {
      console.error('Error: El usuario no está autenticado o el ID de usuario no es válido.');
    }
  }

  getHoraActual(): void {
   this.horaSubscription = this.currenttimeService.getHoraActual().subscribe(
      (hora: Date) => {
        this.horaActual = hora;
      },
      (error) => {
        console.error('Error al obtener la hora actual:', error);
      }
    );
  }

  getkwh(): void {
    const userId = this.authService.getUserId();

    // Fechas para el mes actual
    const FirstDayOfCurrentMonth = this.getFirstDayOfCurrentMonth();
    const startTimeCurrentMonth = new Date(FirstDayOfCurrentMonth);
    const endTimeCurrentMonth = new Date();
    if (userId !== null) {
      // Obtener datos del mes actual
      this.carbonService.getTotalKwhRealTime(userId, startTimeCurrentMonth, endTimeCurrentMonth)
        .subscribe(
          (data: TotalEnergy) => {
            this.consumo = data.totalEnergy*133;
            this.dataCardProgress = data.totalEnergy;
          },
          (error) => {
            console.error('Error al obtener el total de CO2:', error);
          }
        );
      }

  }
  getFirstDayOfCurrentMonth(): string {
    const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), 1);
    return this.formatDateToISO(date);
  }

  formatDateToISO(date: Date): string {
    // Convertir la fecha a ISO, eliminar la parte de milisegundos y agregar la 'Z'
    return date.toISOString().split('.')[0] + 'Z';
  }

  ngOnDestroy(): void {
    if (this.horaSubscription) {
      this.horaSubscription.unsubscribe();
    }
    if (this.measurementsServiceSubscription) {
      this.measurementsServiceSubscription.unsubscribe();
    }
  }
}
