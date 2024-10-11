import {Component, Input, OnInit} from '@angular/core';
import { HumidityService } from '../../shared/services/humidity.service';
import { TemperatureService } from '../../shared/services/temperature.service';
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-card-real-time',
  standalone: true,
  imports: [
    NgClass
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
  public isTemperature: boolean = false;

  constructor(private humidityService: HumidityService,
              private temperatureService: TemperatureService) {}

  ngOnInit(): void {
    // Si es humedad
    if (this.titleCard === 'Humedad') {
      this.humidityService.getHumidity().subscribe((data: any) => {
        this.dataCardProgress = `${data.humidity} g/m3`;
        this.valueProgress = data.humidity;
        this.isTemperature = false;  // No es temperatura
      });
    }

    // Si es temperatura
    if (this.titleCard === 'Temperatura') {
      this.temperatureService.getTemperature().subscribe((data: any) => {
        this.temperature = `${data.temperature} °C`;
        this.valueProgress = data.temperature;
        this.isTemperature = true;  // Se muestra temperatura
      });
    }
  }
}

