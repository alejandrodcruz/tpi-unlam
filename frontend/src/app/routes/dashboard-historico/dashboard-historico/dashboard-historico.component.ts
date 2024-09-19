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
    this.initBarChart();  // Inicializa gráfico de barras
    this.initPieChart();  // Inicializa gráfico circular
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
          type: 'bar',
          barWidth: '60%',
          data: [320, 280, 300, 350, 370, 420, 500, 450, 400, 390, 360, 340],
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
        text: 'Consumo Energético Mensual',
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
          data: [
            { value: 15, name: '00:00-02:00' },
            { value: 12, name: '02:00-04:00' },
            { value: 8, name: '04:00-06:00' },
            { value: 10, name: '06:00-08:00' },
            { value: 18, name: '08:00-10:00' },
            { value: 25, name: '10:00-12:00' },
            { value: 35, name: '12:00-14:00' },
            { value: 30, name: '14:00-16:00' },
            { value: 28, name: '16:00-18:00' },
            { value: 20, name: '18:00-20:00' },
            { value: 22, name: '20:00-22:00' },
            { value: 15, name: '22:00-00:00' }
          ],
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
        feature: {
          saveAsImage: { show: true }
        }
      }
    };

    pieChart.setOption(option);
  }
}

