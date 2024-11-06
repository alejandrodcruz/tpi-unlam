import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import { CurrenttimeService } from '../../shared/services/currenttime.service';
import {DatePipe, NgClass, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import { Measurement, MeasurementsService } from '../../shared/services/measurements.service';
import { AuthService } from '../../shared/services/auth.service';
import { Subscription } from 'rxjs';
import { CarbonService } from '../../shared/services/carbon.service';
import {WebSocketService} from "../../shared/services/web-socket.service";
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

  constructor(
              private measurementsService: MeasurementsService,
              private authService: AuthService,
              private currenttimeService: CurrenttimeService,
              private carbonService: CarbonService,
              private webSocketService: WebSocketService) {}

  ngOnInit(): void {

    this.getMeasurements();

    if (this.titleCard === 'Horario') {
      this.tipoDato = 'horaActual';
      this.getHoraActual();
    }

    if (this.titleCard === 'Consumo') {
      this.tipoDato = 'energy';
      this.getkwhConsume();
    }

  }

  getMeasurements() {
    const userId = this.authService.getUserId();

    if (userId !== null) {
      this.measurementsServiceSubscription = this.measurementsService.getUserMeasurementsRealTime()
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

  getkwhConsume(): void {
    const userId = this.authService.getUserId();
    const FirstDayOfCurrentMonth = this.getFirstDayOfCurrentMonth();
    const startTimeCurrentMonth = new Date(FirstDayOfCurrentMonth);
    if (userId !== null) {
      this.carbonService.startEnergyUpdates(userId, startTimeCurrentMonth)
        .subscribe(() => {
          this.webSocketService.listenConsumeTopic().subscribe((message: any) => {
            const wsData = JSON.parse(message.body);
            this.consumo = wsData.energyCost;
            this.dataCardProgress = wsData.energyCost;
          })
        });
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
