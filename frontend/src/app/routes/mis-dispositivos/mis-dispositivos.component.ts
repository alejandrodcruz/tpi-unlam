import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {FormsModule} from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import {PanelTitleComponent} from "../panel-title/panel-title.component";

@Component({
  selector: 'app-mis-dispositivos',
  standalone: true,
  imports: [
    NgStyle,
    NgForOf,
    NgIf,
    FormsModule,
    PanelTitleComponent
  ],
  templateUrl: './mis-dispositivos.component.html',
  styleUrl: './mis-dispositivos.component.css'
})
export class MisDispositivosComponent implements OnInit {
  isModalOpen = false;
  isCodeModalOpen = false;

  nuevoDispositivoNombre = '';
  nuevoDispositivoTipo = '';
  nuevoDispositivoEstado = '';
  nuevoCodigo = '';

  dispositivos: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    const dispositivosGuardados = localStorage.getItem('dispositivos');
    if (dispositivosGuardados) {
      this.dispositivos = JSON.parse(dispositivosGuardados); // Recupera dispositivos almacenados
    } else {
      this.dispositivos = [
        { nombre: 'Heladera', tipo: 'Heladera', estado: 'Encendido' },
        { nombre: 'Aire Acondicionado', tipo: 'Aire Acondicionado', estado: 'Apagado' },
        { nombre: 'Microondas', tipo: 'Microondas', estado: 'Encendido' }
      ];
    }
  }

  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  // modal de código
  openCodeModal() {
    this.isCodeModalOpen = true;
  }

  closeCodeModal() {
    this.isCodeModalOpen = false;
  }

  agregarDispositivo() {
    if (this.nuevoDispositivoNombre && this.nuevoDispositivoTipo && this.nuevoDispositivoEstado) {
      const nuevoDispositivo = {
        nombre: this.nuevoDispositivoNombre,
        tipo: this.nuevoDispositivoTipo,
        estado: this.nuevoDispositivoEstado,
      };
      this.dispositivos.push(nuevoDispositivo); // Agregar el nuevo dispositivo a la lista
      this.guardarEnLocalStorage(); // Guardar en localStorage

      // Limpiar campos y cerrar modal
      this.nuevoDispositivoNombre = '';
      this.nuevoDispositivoTipo = '';
      this.nuevoDispositivoEstado = '';
      this.closeModal();
    }
  }

  getIconoPorTipo(tipo: string): string {
    switch (tipo.toLowerCase()) {
      case 'heladera':
        return '❄️';
      case 'aire acondicionado':
        return '🌬️';
      case 'microondas':
        return '🍴';
      case 'televisor':
        return '📺';
      case 'lavarropas':
        return '🌀';
      default:
        return '⚙️';
    }
  }

  guardarCodigo() {
    if (this.nuevoCodigo) {
      localStorage.setItem('codigo', this.nuevoCodigo); // Guardar el código en localStorage

      // Enviar el código a la API
      const requestBody = {
        pairingCode: this.nuevoCodigo,
        userId: 1  // usuario: lucas
      };

      this.http.post('http://localhost:8080/api/pair-device', requestBody)
        .subscribe(
          response => {
            console.log('Código de emparejamiento enviado exitosamente:', response);
          },
          error => {
            console.error('Error al enviar el código:', error);
            console.error('Detalles del error:', error.message);
          }
        );

      // Limpiar campo y cerrar modal
      this.nuevoCodigo = '';
      this.closeCodeModal();
    }
  }

  // Guardar dispositivos en localStorage
  guardarEnLocalStorage() {
    localStorage.setItem('dispositivos', JSON.stringify(this.dispositivos));
  }

}
