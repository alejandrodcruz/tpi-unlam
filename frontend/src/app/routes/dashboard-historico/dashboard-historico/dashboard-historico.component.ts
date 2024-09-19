import {Component, OnInit} from '@angular/core';
import * as echarts from 'echarts';
import {SidebarComponent} from "../../sidebar/sidebar.component";

@Component({
  selector: 'app-dashboard-historico',
  standalone: true,
  imports: [
    SidebarComponent

  ],
  templateUrl: './dashboard-historico.component.html',
  styleUrl: './dashboard-historico.component.css'
})
export class DashboardHistoricoComponent implements OnInit{
  constructor() { }

  ngOnInit(): void {
    this.initChart();
  }

  initChart(): void {
    const chartDom = document.getElementById('consumption-chart') as HTMLElement;
    const myChart = echarts.init(chartDom);

    const option = {
      title: {
        text: 'Consumo Eléctrico Mensual (kWh)',
        left: 'center'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {  // Añadido para mejorar la interacción con barras
          type: 'shadow'
        }
      },
      xAxis: {
        type: 'category',
        data: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
        axisTick: { alignWithLabel: true }
      },
      yAxis: {
        type: 'value',
        name: 'Consumo (kWh)'
      },
      series: [
        {
          name: 'Consumo',
          type: 'bar',  // Cambiado a 'bar' para gráfico de barras
          barWidth: '60%',  // Ancho de las barras
          data: [320, 280, 300, 350, 370, 420, 500, 450, 400, 390, 360, 340],
          itemStyle: {
            color: '#3E92CC'  // Color personalizado para las barras
          }
        }
      ],
      toolbox: {
        feature: {
          saveAsImage: { show: true }
        }
      }
    };

    myChart.setOption(option);
  }
}

