import { Component, OnInit } from '@angular/core';
import { HistorialService } from "../../shared/services/historial.service";
import { SafeUrlPipe } from "../../shared/pipes/safe-url.pipe";
import { CommonModule, NgClass } from '@angular/common';
import { PanelTitleComponent } from "../panel-title/panel-title.component";
import { CardRealTimeComponent } from "../../core/card-real-time/card-real-time.component";
import { DashboardPanelComponent } from "../../core/dashboard-panel/dashboard-panel.component";
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { UserService } from '../../shared/services/user.service';

@Component({
  selector: 'app-dashboard-historico',
  templateUrl: './dashboard-historico.component.html',
  standalone: true,
  imports: [
    SafeUrlPipe,
    CommonModule,
    PanelTitleComponent, NgClass,
    CommonModule,
    CardRealTimeComponent, DashboardPanelComponent,
  ],
  styleUrls: ['./dashboard-historico.component.css']
})
export class DashboardHistoricoComponent implements OnInit {

  consumoMensual: string = '';
  public selectedDevice: string = '';
  powerLastYearUrl: SafeResourceUrl | undefined;
  voltageLastYearUrl: SafeResourceUrl | undefined;
  histEnergyMonthUrl: SafeResourceUrl | undefined;
  histEnergyUrl: SafeResourceUrl | undefined;

  alertasHistoricas: { tipo: string, descripcion: string }[] = [];
  filtroSeleccionado: string = 'todos';

  graficoSeleccionado: string = ''; // Variable para el gráfico seleccionado
  graficoTitulo: string = ''; // Variable para el título del gráfico

  constructor(private historialService: HistorialService,private userService: UserService, private sanitizer: DomSanitizer) {}

  ngOnInit(): void {

    this.userService.selectedDevice$.subscribe(device => {
      this.selectedDevice = device;
      if (this.selectedDevice) {
        this.updateIframeUrl();
      }
    });
    this.cargarAlertasHistoricas();
  }

  updateIframeUrl() {
    if (this.selectedDevice) {
      const powerLastYearUrl = `https://localhost:3000/d-solo/ee1me0bqeal8gf/power-last-year?orgId=1&panelId=1&var-deviceId=${this.selectedDevice}&refresh=5s`;
      this.powerLastYearUrl = this.sanitizer.bypassSecurityTrustResourceUrl(powerLastYearUrl);
      const voltageLastYearUrl = `https://localhost:3000/d-solo/ae1mdiw2xsb28c/voltage-last-year?orgId=1&panelId=1&var-deviceId=${this.selectedDevice}&refresh=5s`;
      this.voltageLastYearUrl = this.sanitizer.bypassSecurityTrustResourceUrl(voltageLastYearUrl);
      const histEnergyMonthUrl = `https://localhost:3000/d-solo/fe1mcple571fkf/hist-energy-month?orgId=1&panelId=1&var-deviceId=${this.selectedDevice}&refresh=5s`;
      this.histEnergyMonthUrl = this.sanitizer.bypassSecurityTrustResourceUrl(histEnergyMonthUrl);
      const histEnergyUrl = `https://localhost:3000/d-solo/ae1m3p3ni09vke/hist-energy?orgId=1&panelId=1&var-deviceId=${this.selectedDevice}&refresh=5s`;
      this.histEnergyUrl = this.sanitizer.bypassSecurityTrustResourceUrl(histEnergyUrl);
    }
  }


  cargarAlertasHistoricas(): void {
    this.historialService.getAlertasHistoricas().subscribe(alertas => {
      this.alertasHistoricas = alertas;
    });
  }

  aplicarFiltro(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.filtroSeleccionado = selectElement.value;
  }

  getAlertasFiltradas(): { tipo: string, descripcion: string }[] {
    if (this.filtroSeleccionado === 'todos') {
      return this.alertasHistoricas;
    }
    return this.alertasHistoricas.filter(alerta => alerta.tipo === this.filtroSeleccionado);
  }

  abrirModal(grafico: string) {
    this.graficoSeleccionado = grafico;

    switch (grafico) {
      case 'consumoMensual':
        this.graficoTitulo = 'Consumo Mensual Histórico';
        break;
      case 'amperaje':
        this.graficoTitulo = 'Intensidad de Amperaje Histórico';
        break;
      case 'potencia':
        this.graficoTitulo = 'Potencia Histórica';
        break;
      case 'frecuencia':
        this.graficoTitulo = 'Frecuencia Histórica';
        break;
      default:
        this.graficoTitulo = ''; // Título por defecto
    }
  }

  cerrarModal() {
    this.graficoSeleccionado = '';
  }
}


/*
  cargarConsumoUltimoMes(): void {
    this.historialService.getConsumoUltimoMesGrafanaUrl().subscribe(url => {
      this.consumoDiario = url;
    });
  }

  cargarConsumoUltimoAnio(): void {
    this.historialService.getConsumoUltimoAñoGrafanaUrl().subscribe(url => {
      this.intensidadAmperaje = url;
    });
  }

  cargarPotencia(): void {
    this.historialService.getPotenciaGrafanaUrl().subscribe(url => {
      this.potencia = url;
    });
  }

  cargarVoltaje(): void {
    this.historialService.getVoltajeGrafanaUrl().subscribe(url => {
      this.frecuencia = url;
    });
  }
import { Component, OnInit } from '@angular/core';
import {HistorialService} from "../../shared/services/historial.service";
import {SafeUrlPipe} from "../../shared/pipes/safe-url.pipe";
import { CommonModule } from '@angular/common';
import {PanelTitleComponent} from "../panel-title/panel-title.component";


@Component({

  selector: 'app-dashboard-historico',
  templateUrl: './dashboard-historico.component.html',
  standalone: true,
    imports: [
        SafeUrlPipe,
        CommonModule,
        PanelTitleComponent
    ],
  styleUrls: ['./dashboard-historico.component.css']
})
export class DashboardHistoricoComponent implements OnInit {
  consumoMensual: string = '';
  consumoDiario: string = '';
  intensidadAmperaje: string = '';
  potencia: string = '';
  frecuencia: string = '';
  alertasHistoricas: { tipo: string, descripcion: string }[] = [];
  filtroSeleccionado: string = 'todos';

  graficoSeleccionado: string = ''; // Variable para el gráfico seleccionado
  graficoTitulo: string = ''; // Variable para el título del gráfico

  constructor(private historialService: HistorialService) {}

ngOnInit(): void {
  this.cargarConsumoMensual();
  this.cargarConsumoDiario();
  this.cargarIntensidadAmperaje();
  this.cargarPotencia();
  this.cargarFrecuencia();
  this.cargarAlertasHistoricas();
}

cargarConsumoMensual(): void {
  this.historialService.getConsumoMensual().subscribe(data => {
    this.consumoMensual = data;
  });
}

cargarConsumoDiario(): void {
  this.historialService.getConsumoDiario().subscribe(data => {
    this.consumoDiario = data;
  });
}

cargarIntensidadAmperaje(): void {
  this.historialService.getIntensidadAmperaje().subscribe(data => {
    this.intensidadAmperaje = data;
  });
}

cargarPotencia(): void {
  this.historialService.getPotencia().subscribe(data => {
    this.potencia = data;
  });
}

cargarFrecuencia(): void {
  this.historialService.getFrecuencia().subscribe(data => {
    this.frecuencia = data;
  });
}

cargarAlertasHistoricas(): void {
  this.historialService.getAlertasHistoricas().subscribe(alertas => {
    this.alertasHistoricas = alertas;
  });
}

loadAlertasHistoricas(): void {
  this.historialService.getAlertasHistoricas().subscribe({
    next: (data) => {
      this.alertasHistoricas = data;
    },
    error: (err) => console.error('Error fetching alertas historicas:', err)
  });
}

aplicarFiltro(event: Event): void {
  const selectElement = event.target as HTMLSelectElement;
  this.filtroSeleccionado = selectElement.value;
}

getAlertasFiltradas(): { tipo: string, descripcion: string }[] {
  if (this.filtroSeleccionado === 'todos') {
    return this.alertasHistoricas;
  }
  return this.alertasHistoricas.filter(alerta => alerta.tipo === this.filtroSeleccionado);
}

abrirModal(grafico: string) {
  this.graficoSeleccionado = grafico;

  switch (grafico) {
    case 'consumoMensual':
      this.graficoTitulo = 'Consumo Mensual Historico';
      break;
    case 'amperaje':
      this.graficoTitulo = 'Intensidad de Amperaje Historico';
      break;
    case 'potencia':
      this.graficoTitulo = 'Potencia Historica';
      break;
    case 'frecuencia':
      this.graficoTitulo = 'Frecuencia Historica';
      break;
    default:
      this.graficoTitulo = ''; // Título por defecto
  }
}

cerrarModal() {
  this.graficoSeleccionado = "";
}

}
*/
