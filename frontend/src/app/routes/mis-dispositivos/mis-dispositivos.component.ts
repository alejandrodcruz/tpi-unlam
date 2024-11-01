import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {FormsModule} from "@angular/forms";
import { HttpClient } from '@angular/common/http';
import {PanelTitleComponent} from "../panel-title/panel-title.component";
import { Device, UserService } from '../../shared/services/user.service';
import { DevicePopupComponent } from '../../core/device-popup/device-popup.component';

@Component({
  selector: 'app-mis-dispositivos',
  standalone: true,
  imports: [
    NgStyle,
    NgForOf,
    NgIf,
    FormsModule,
    PanelTitleComponent,
    DevicePopupComponent
  ],
  templateUrl: './mis-dispositivos.component.html',
  styleUrl: './mis-dispositivos.component.css'
})
export class MisDispositivosComponent implements OnInit {
  isDevicePopupOpen = false;

  dispositivos: Device[] = [];

  constructor(private http: HttpClient, private userService: UserService) {}

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
    this.loadDevices(); // Recargar la lista de dispositivos después de agregar uno nuevo
  }

}
