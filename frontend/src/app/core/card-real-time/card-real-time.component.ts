import {Component, Input, OnInit} from '@angular/core';
import { CurrenttimeService } from '../../shared/services/currenttime.service';
import {DatePipe, NgClass, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import { Measurement, MeasurementsService } from '../../shared/services/measurements.service';
import { AuthService } from '../../shared/services/auth.service';


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
export class CardRealTimeComponent implements OnInit {
  measurements: Measurement[] = [];

  @Input() iconClasses: string = '';
  @Input() titleCard: string = '';
  @Input() dataCardProgress: string = 'Cargando...';
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
              private currentTimeService: CurrenttimeService,
              private measurementsService: MeasurementsService,
              private authService: AuthService) {}

  ngOnInit(): void {

    this.getMeasurements();
    this.getHoraActual();

    if (this.titleCard === 'Horario') {
      this.tipoDato = 'horaActual';  // Se muestra la hora actual

      // Crear un intervalo para actualizar la hora cada segundo
      setInterval(() => {
        this.currentTimeService.getHoraActual().subscribe((data: any) => {
          this.currenTime = new Date(data.datetime).toLocaleTimeString();
        });
      }, 50000); // Intervalo de 1 segundo (1000 ms)
    }
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
                this.dataCardProgress = <any>firstMeasurement.humidity;
                this.tipoDato = 'humidity';
              }

              if (this.titleCard === 'Temperatura') {
                this.temperature = firstMeasurement.temperature;
                this.dataCardProgress = <any>firstMeasurement.temperature;
                this.tipoDato = 'temperature';
              }

              if (this.titleCard === 'Consumo') {
                this.consumo = firstMeasurement.energy;
                this.dataCardProgress = <any>firstMeasurement.energy;
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
    this.currentTimeService.getHoraActual().subscribe(time => {
      this.currenTime = time;
    });
  }

}
