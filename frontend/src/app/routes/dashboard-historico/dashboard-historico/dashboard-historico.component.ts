import { Component, OnInit } from '@angular/core';
import * as echarts from 'echarts';
import { SidebarComponent } from "../../sidebar/sidebar.component";
import {HistorialService} from "../../../shared/services/historial.service";


@Component({
  selector: 'app-dashboard-historico',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './dashboard-historico.component.html',
  styleUrl: './dashboard-historico.component.css'
})
export class DashboardHistoricoComponent implements OnInit {
  meses: string[] = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  consumoMensual: number[] = [];
  consumoDiario: { value: number, name: string }[] = [];

  constructor(private historialService: HistorialService) { }

  ngOnInit(): void {
    this.loadConsumoMensual();
    this.loadConsumoDiario();
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
        text: 'Consumo Energético Diario por Franja Horaria',
        subtext: 'Por hora (kWh)',
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
}

