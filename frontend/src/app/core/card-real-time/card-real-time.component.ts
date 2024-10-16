import {Component, Input, OnInit} from '@angular/core';
import { HumidityService } from '../../shared/services/humidity.service';
import { TemperatureService } from '../../shared/services/temperature.service';
import { CurrenttimeService } from '../../shared/services/currenttime.service';
import {DatePipe, NgClass, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
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
    DatePipe
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

  constructor(private humidityService: HumidityService,
              private temperatureService: TemperatureService,
              private currentTimeService: CurrenttimeService,
              private measurementsService: MeasurementsService,
              private authService: AuthService) {}

  ngOnInit(): void {

    this.getMeasurements();
    this.getHoraActual();

    // Asignación de tipoDato según el título de la tarjeta
    if (this.titleCard === 'Humedad') {
      this.humidityService.getHumidity().subscribe((data: any) => {
        console.log('Datos recibidos:', data);
           this.dataCardProgress = data;
        this.humidity=data;
        this.tipoDato = 'humidity';

      });
    }

    if (this.titleCard === 'Temperatura') {
      this.temperatureService.getTemperature().subscribe((data: any) => {
        this.temperature = data;
        this.tipoDato = 'temperature';  // Se muestra temperatura
      });
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

    //Falta CALCULO DE CONSUMO
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
            console.log('Mediciones obtenidas:', this.measurements);
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
