import {Component, Input, OnInit} from '@angular/core';
import { HumidityService } from '../../shared/services/humidity.service';
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

  constructor(private humidityService: HumidityService) {}

  ngOnInit(): void {
    this.humidityService.getHumidity().subscribe((data: any) => {
      // Aquí deberás adaptar según cómo llegue la respuesta de Grafana
      this.dataCardProgress = `${data.humidity} g/m3`;
      this.valueProgress = data.humidity;  // Asume que "humidity" contiene el valor en %.
    });
  }
}
