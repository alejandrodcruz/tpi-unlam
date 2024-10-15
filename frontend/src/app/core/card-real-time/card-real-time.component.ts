import {Component, Input, OnInit} from '@angular/core';
import { HumidityService } from '../../shared/services/humidity.service';
import { TemperatureService } from '../../shared/services/temperature.service';
import { CurrenttimeService } from '../../shared/services/currenttime.service';
import {NgClass, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";

@Component({
  selector: 'app-card-real-time',
  standalone: true,
  imports: [
    NgClass,
    NgSwitch,
    NgSwitchCase,
    NgSwitchDefault
  ],
  templateUrl: './card-real-time.component.html',
  styleUrl: './card-real-time.component.css'
})
export class CardRealTimeComponent implements OnInit {

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

  constructor(private humidityService: HumidityService,
              private temperatureService: TemperatureService,
              private currentTimeService: CurrenttimeService) {}

  ngOnInit(): void {
    // Asignación de tipoDato según el título de la tarjeta
    if (this.titleCard === 'Humedad') {
      this.humidityService.getHumidity().subscribe((data: any) => {
        this.dataCardProgress = `${data.humidity} g/m3`;
        this.valueProgress = data.humidity;
        this.tipoDato = 'humidity';  // Se muestra humedad
      });
    }

    if (this.titleCard === 'Temperatura') {
      this.temperatureService.getTemperature().subscribe((data: any) => {
        this.temperature = `${data.temperature} °C`;
        this.valueProgress = data.temperature;
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
      }, 1000); // Intervalo de 1 segundo (1000 ms)
    }

   //Falta CALCULO DE CONSUMO
    }
  }


