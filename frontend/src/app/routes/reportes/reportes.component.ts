import { Component } from '@angular/core';
import { SafeUrlPipe } from "../../shared/pipes/safe-url.pipe";
import { FormsModule } from "@angular/forms";
import { DecimalPipe, NgClass, NgFor, NgIf } from "@angular/common";
import { PanelTitleComponent } from "../panel-title/panel-title.component";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ConsumptionService, DeviceDetail } from "../../shared/services/consumption.service";
import { AuthService } from "../../shared/services/auth.service";
import { UserService } from "../../shared/services/user.service";
import { Address, AddressService } from "../../shared/services/address.service";



@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  standalone: true,
  imports: [
    SafeUrlPipe,
    FormsModule,
    NgClass,
    NgIf,
    NgFor,
    PanelTitleComponent,
    DecimalPipe
  ],
  styleUrls: ['./reportes.component.css']
})
export class ReportesComponent {
  private selectedDevice: string | null = null;
  selectedType: string  = 'Consumo';
  startTime: Date = new Date();
  endTime: Date = new Date()
  userId: number | null = 0;
  data: DeviceDetail[] = [];
  errorMessage: string | null = null;
  devices: string[] =[];
  addresses: Address[] = [];
  username: string | null = null;
  consumoTotal: number = 0;
  costoTotal: number = 0;

  constructor(private consumptionService: ConsumptionService,
              private authService: AuthService,
              private userService: UserService,
              private addressService: AddressService) {
    this.userService.getUserData();
    this.userService.selectedDevice$.subscribe((deviceId) => {
      this.selectedDevice = deviceId;
    });
    this.userService.user$.subscribe((user) => {
      if (user) {
        this.username = user.username;
      }
    });
  }


  generateReporteDatos(): void {
    this.userId = this.authService.getUserId();

    if (!this.selectedType || !this.startTime || !this.endTime || !this.userId) {
      this.errorMessage = "Por favor, selecciona un tipo de reporte y un rango de fechas antes de buscar.";
      return;
    } else {
      if (!(this.startTime instanceof Date)) {
        this.startTime = new Date(this.startTime);
      }
      if (!(this.endTime instanceof Date)) {
        this.endTime = new Date(this.endTime);
      }
      const deviceId = this.selectedDevice ?? undefined;

      this.addressService.getAddressesByUser(this.userId).subscribe((addresses) => {
        this.addresses = addresses;
        this.addresses.forEach(address => {
          console.log("contenido de la variable Street:", address.street, "usuario logueado: ", this.username);
        });
      });

      this.consumptionService.getTotalKwhAndConsumption(this.userId, this.startTime, this.endTime)
        .subscribe(response => {
          this.data = response.devicesDetails;
          this.errorMessage = null;

          // Calcular la suma total de consumo
          this.consumoTotal = this.data.reduce((total, device) => total + device.totalEnergy, 0);
          this.costoTotal = this.data.reduce((total, device) => total + device.energyCost, 0);

        }, error => {
          this.errorMessage = "Error al obtener los datos";
        });
    }
  }


  exportToPDF(): void {
    if (this.data.length === 0 || !Array.isArray(this.data)) {
      this.errorMessage = 'No hay datos disponibles para exportar.';
      return;
    }

    const doc = new jsPDF();
    const currentDate = new Date();
    const appName = 'Lytics';

    // Configuración de propiedades del documento
    doc.setProperties({
      title: 'Informe Lytics',
      subject: 'Informe de Consumo',
      author: appName,
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Encabezado
    doc.setFontSize(22);
    doc.text("Informe de Consumo", pageWidth / 2, 20, { align: 'center' });

    doc.setFontSize(14);
    doc.setTextColor(100);
    doc.text(appName, pageWidth - 10, 15, { align: 'right' });
    doc.text(`Fecha: ${currentDate.toLocaleDateString('es-AR')}`, pageWidth - 10, 25, { align: 'right' });

    doc.setLineWidth(0.5);
    doc.line(10, 30, pageWidth - 10, 30);

    // Subtítulo
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Usuario: " + this.username, 15, 40);

    // Línea de resumen
    doc.setFontSize(8);
    doc.setTextColor(0);
    doc.text("Resumen de Consumo desde " + this.startTime.toLocaleDateString('es-AR') + ' al ' + this.endTime.toLocaleDateString('es-AR'), 15, 45);

    // Tabla de datos
    const startingY = 50;
    const tableColumnHeaders = ["Locación", "Identificador", "Dispositivo", "Consumo", "Costo"];
    const tableData = [];

    let consumoTotal = 0;
    let costoTotal = 0;

    for (let dato of this.data) {
      const totalEnergyValue = Number(dato.totalEnergy);
      const energyCostValue = Number(dato.energyCost);

      consumoTotal += totalEnergyValue;
      costoTotal += energyCostValue;

      tableData.push([
        this.addresses[0].street,
        dato.deviceId,
        dato.name,
        totalEnergyValue.toFixed(2) + ' Kwh',
        energyCostValue.toFixed(2) + ' $'
      ]);
    }

    // Generar tabla de datos
    autoTable(doc, {
      head: [tableColumnHeaders],
      body: tableData,
      startY: startingY,
      styles: {
        halign: 'center',
        valign: 'middle',
        fontSize: 10,
        cellPadding: 4,
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: [255, 255, 255],
        fontSize: 12,
      },
      alternateRowStyles: { fillColor: [240, 240, 240] },
      tableLineWidth: 0.2,
      tableLineColor: [200, 200, 200],
    });

    // Calcular el Y para la fila de totales manualmente
    const rowHeight = 10; // Altura estimada de cada fila en la tabla
    const finalY = startingY + (tableData.length * rowHeight) + 20; // Ajustar el espacio

    // Fila de totales
    autoTable(doc, {
      body: [[
        "Total",
        "                                 ", // Espacio vacío para las columnas sin totales
        "                                 ",
        consumoTotal.toFixed(2) + ' Kwh',
        costoTotal.toFixed(2) + ' $'
      ]],
      startY: finalY,
      styles: {
        fontSize: 10,
        cellPadding: 4,
        fontStyle: 'bold',
        halign: 'center',
      },
      tableLineWidth: 0.2,
      tableLineColor: [200, 200, 200],
    });

    // Pie de página
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text(`Generado por ${appName}`, pageWidth / 2, pageHeight - 10, { align: 'center' });

    // Guardar el PDF
    doc.save('reporte.pdf');
  }



}
