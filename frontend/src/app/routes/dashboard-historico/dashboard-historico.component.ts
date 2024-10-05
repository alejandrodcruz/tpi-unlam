
import {AfterViewInit, Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as echarts from 'echarts';
import { HistorialService } from "../../shared/services/historial.service";
import {SidebarComponent} from "../../core/sidebar/sidebar.component";

@Component({
  selector: 'app-dashboard-historico',
  standalone: true,
  imports: [CommonModule, SidebarComponent],
  templateUrl: './dashboard-historico.component.html',
  styleUrls: ['./dashboard-historico.component.css']
})

export class DashboardHistoricoComponent implements OnInit {
  meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  consumoMensual: number[] = [];
  consumoDiario: { value: number, name: string }[] = [];
  alertasHistoricas: { tipo: string, descripcion: string }[] = [];
  filtroSeleccionado: string = 'todos';


  mostrarConsumoMensual: boolean = true;
  mostrarConsumoDiario: boolean = false;

  constructor(private historialService: HistorialService) { }

  ngOnInit(): void {
    this.loadConsumoMensual();
    this.loadConsumoDiario();
    this.loadAlertasHistoricas();
  }


  loadConsumoMensual(): void {
    this.historialService.getConsumoMensual().subscribe({
      next: (data) => {
        this.consumoMensual = data;
        this.initBarChart();
      },
      error: (err) => console.error('Error fetching consumo mensual:', err)
    });
  }

  loadConsumoDiario(): void {
    this.historialService.getConsumoDiario().subscribe({
      next: (data) => {
        this.consumoDiario = data;
        this.initPieChart();
      },
      error: (err) => console.error('Error fetching consumo diario:', err)
    });
  }

  initBarChart(): void {
    const chartDom = document.getElementById('consumption-chart') as HTMLElement;
    const myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: 'Consumo Eléctrico Mensual (kWh)',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: { type: 'shadow' }
      },
      xAxis: {
        type: 'category',
        data: this.meses,
        axisTick: { alignWithLabel: true }
      },
      yAxis: {
        type: 'value',
        name: 'Consumo (kWh)'
      },
      series: [
        {
          name: 'Consumo',
          type: 'bar',
          barWidth: '60%',
          data: this.consumoMensual,
          itemStyle: { color: '#3E92CC' }
        }
      ],
      toolbox: {
        feature: { saveAsImage: { show: true } }
      }
    };

    myChart.setOption(option);
  }

  initPieChart(): void {
    const pieChartDom = document.getElementById('daily-consumption-chart') as HTMLElement;
    const pieChart = echarts.init(pieChartDom);

    const option = {
      title: {
        text: 'Consumo Energético Diario (kWh)',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: 'Consumo',
          type: 'pie',
          radius: '50%',
          data: this.consumoDiario,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ],
      toolbox: {
        feature: { saveAsImage: { show: true } }
      }
    };

    pieChart.setOption(option);
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


  toggleGrafico(tipo: string, event: any): void {
    if (tipo === 'consumption') {
      this.mostrarConsumoMensual = true;
      this.mostrarConsumoDiario = false;
      setTimeout(() => this.initBarChart(), 0);
    } else if (tipo === 'daily') {
      this.mostrarConsumoMensual = false;
      this.mostrarConsumoDiario = true;
      setTimeout(() => this.initPieChart(), 0);
    }
  }

}

/*
import { Component, OnInit } from '@angular/core';
import {HistorialService} from "../../shared/services/historial.service";
import {SafeUrlPipe} from "../../shared/pipes/safe-url.pipe";


@Component({

  selector: 'app-dashboard-historico',
  templateUrl: './dashboard-historico.component.html',
  standalone: true,
  imports: [
    SafeUrlPipe
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

  mostrarConsumoMensual: boolean = true;
  mostrarConsumoDiario: boolean = false;
  mostrarAmperaje: boolean = false;
  mostrarPotencia: boolean = false;
  mostrarFrecuencia: boolean = false;

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

  toggleGrafico(type: string): void {
    this.mostrarConsumoMensual = type === 'consumption';
    this.mostrarConsumoDiario = type === 'daily';
    this.mostrarAmperaje = type === 'amperage';
    this.mostrarPotencia = type === 'power';
    this.mostrarFrecuencia = type === 'frequency';
  }
}
*/
