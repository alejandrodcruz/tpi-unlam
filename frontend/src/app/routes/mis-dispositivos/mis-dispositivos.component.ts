import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForOf, NgIf, NgStyle } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router'; // Importa el Router
import { PanelTitleComponent } from "../panel-title/panel-title.component";
import { Device, UserService } from '../../shared/services/user.service';
import { DevicePopupComponent } from '../../core/device-popup/device-popup.component';
import { DeviceService } from '../../shared/services/device.service';
import { GenericPopupComponent } from '../../core/generic-popup/generic-popup.component';

@Component({
  selector: 'app-mis-dispositivos',
  standalone: true,
  imports: [
    NgStyle,
    NgForOf,
    NgIf,
    FormsModule,
    PanelTitleComponent,
    DevicePopupComponent,
    GenericPopupComponent
  ],
  templateUrl: './mis-dispositivos.component.html',
  styleUrls: ['./mis-dispositivos.component.css']
})
export class MisDispositivosComponent implements OnInit {
  isDevicePopupOpen = false;

  @ViewChild('confirmationModal') confirmationModal!: GenericPopupComponent;
  modalTitle = '';
  modalMessage = '';
  currentDevice: Device | null = null;
  modalAction: 'edit' | 'delete' = 'delete';

  dispositivos: Device[] = [];
  public deviceId: string = '';
  public deviceName: string = '';
  public title: string = '';

  constructor(
    private userService: UserService,
    private deviceService: DeviceService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadDevices();
  }

  loadDevices() {
    this.userService.getUserDevices().subscribe((devices) => {
      this.dispositivos = devices;
    });
  }

  openDevicePopup() {
    this.isDevicePopupOpen = true;
  }

  closeDevicePopup() {
    this.isDevicePopupOpen = false;
    this.loadDevices();
  }

  openEditModal(device: Device) {
    this.currentDevice = device;
    this.modalAction = 'edit';
    this.modalTitle = 'Editar Dispositivo';
    this.modalMessage = `¿Deseas editar el dispositivo "${device.name}"?`;
    this.confirmationModal.open();
  }

  openDeleteModal(device: Device) {
    this.currentDevice = device;
    this.modalAction = 'delete';
    this.modalTitle = 'Eliminar Dispositivo';
    this.modalMessage = `¿Estás seguro de que deseas eliminar el dispositivo "${device.name}"?`;
    this.confirmationModal.open();
  }

 onModalConfirm() {
    if (!this.currentDevice) return;

    if (this.modalAction === 'edit') {
      // Lógica para editar el dispositivo
      const newName = prompt("Introduce el nuevo nombre del dispositivo:", this.currentDevice.name);
      if (newName && newName !== this.currentDevice.name) {
        this.deviceService.updateDevice(this.currentDevice.deviceId, newName).subscribe((updatedDevice) => {
          this.currentDevice!.name = updatedDevice.name;
        });
        this.loadDevices();
      }
    } else if (this.modalAction === 'delete') {
      // Lógica para eliminar el dispositivo
      this.deviceService.deleteDevice(this.currentDevice.deviceId).subscribe(() => {
        this.dispositivos = this.dispositivos.filter((device) => device.deviceId !== this.currentDevice!.deviceId);
      });
      this.loadDevices();
    }

    this.currentDevice = null;
    this.loadDevices();
  }

  onModalCancel() {
    this.currentDevice = null;
  }

  goToConfiguration(deviceId: string) {
    this.router.navigate(['/home/configuracion', deviceId]);
  }

}
