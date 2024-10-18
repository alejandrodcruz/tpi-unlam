import {Component, Input, OnInit} from '@angular/core';
import { HumidityService } from '../../shared/services/humidity.service';
import { TemperatureService } from '../../shared/services/temperature.service';
import { CurrenttimeService } from '../../shared/services/currenttime.service';
import {DatePipe, NgClass, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import { Measurement, MeasurementsService } from '../../shared/services/measurements.service';
import { AuthService } from '../../shared/services/auth.service';
import {interval, switchMap} from "rxjs";

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
  @Input() temperature: string = 'Cargando...';
  @Input() currenTime: string = 'Cargando...';

  public tipoDato: string="";
  public humidity: any;
  public totalEnergy: any;

  constructor(private humidityService: HumidityService,
              private temperatureService: TemperatureService,
              private currentTimeService: CurrenttimeService,
              private measurementsService: MeasurementsService,
              private authService: AuthService) {}

  ngOnInit(): void {

    this.getMeasurements();
    this.getHoraActual();

    if (this.titleCard === 'Humedad') {
      this.humidityService.getHumidity().subscribe((data: any) => {
        this.dataCardProgress = data;
        this.humidity = data;
        this.tipoDato = 'humidity';

      });
    }

    if (this.titleCard === 'Temperatura') {
      /*
      this.temperatureService.getTemperature().subscribe((data: any) => {
        this.temperature = data;
        this.tipoDato = 'temperature';  // Se muestra temperatura
      });
       */
    }

    if (this.titleCard === 'Horario') {
      this.tipoDato = 'horaActual';  // Se muestra la hora actual

      // Crear un intervalo para actualizar la hora cada segundo
      setInterval(() => {
        this.currentTimeService.getHoraActual().subscribe((data: any) => {
          this.currenTime = new Date(data.datetime).toLocaleTimeString();
        });
      }, 50000); // Intervalo de 1 segundo (1000 ms)
    }
    if (this.titleCard === 'Consumo') {

      interval(10000) // Cambio (30 segundos)
        .pipe(
          // Llama a getTotalEnergy en cada intervalo
          switchMap(() => this.measurementsService.getTotalEnergy(1, ['energy'], '1h'))
        )
        .subscribe(
          (energyTotal: number) => {
            this.totalEnergy = energyTotal; // Actualizar el valor de totalEnergy
            this.tipoDato = 'energy';
          },
          error => {
            console.error('Error al obtener el total de energía:', error);
          }
        );
    }
  }



  getMeasurements() {
    const userId = this.authService.getUserId();
    const fields = ['humidity', 'temperature', 'timestamp', 'energy']; //campos espesificos
    const timeRange = '10s';

    if (userId !== null) {
      this.measurementsService.getUserMeasurements(userId, fields, timeRange)
        .subscribe(
          (data) => {
            this.measurements = data;
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
    /*this.currentTimeService.getHoraActual().subscribe(time => {
      this.currenTime = time;
    });
     */
  }

}
