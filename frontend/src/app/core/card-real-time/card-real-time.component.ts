import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { CurrenttimeService } from '../../shared/services/currenttime.service';
import {DatePipe, NgClass, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import { Measurement, MeasurementsService } from '../../shared/services/measurements.service';
import { AuthService } from '../../shared/services/auth.service';
import { interval, Subscription } from 'rxjs';


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
              private currenttimeService: CurrenttimeService) {}

  ngOnInit(): void {

    this.getMeasurements();

    if (this.titleCard === 'Horario') {
      this.tipoDato = 'horaActual';
    this.getHoraActual();}
  }

  getMeasurements() {
    const userId = this.authService.getUserId();
    const fields = ['humidity', 'temperature', 'timestamp', 'energy']; //campos espesificos
    const timeRange = '10s';

    if (userId !== null) {
      this.measurementsService.getUserMeasurementsRealTime(userId, fields, timeRange)
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

              if (this.titleCard === 'Consumo') {
                this.consumo = firstMeasurement.energy;
                this.dataCardProgress = firstMeasurement.energy;
                this.tipoDato = 'energy';
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

  ngOnDestroy(): void {
    if (this.horaSubscription) {
      this.horaSubscription.unsubscribe();
    }
  }
}
