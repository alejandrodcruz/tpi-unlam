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
