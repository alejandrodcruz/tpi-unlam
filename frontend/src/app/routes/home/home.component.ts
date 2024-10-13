import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../core/sidebar/sidebar.component';
import { ToolbarComponent } from '../../core/toolbar/toolbar.component';
import { CommonModule } from '@angular/common';
import {AlertsComponent} from "../alerts/alerts.component";
import {AlertComponent} from "../../shared/alert/alert.component";
import { DevicePopupComponent } from '../../core/device-popup/device-popup.component';
import { AuthService, User } from '../../shared/services/auth.service';
import { DeviceService } from '../../shared/services/device.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterModule,
    SidebarComponent,
    ToolbarComponent,
    CommonModule,
    AlertsComponent,
    AlertComponent,
    DevicePopupComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isSidebarOpen = true;
  screenWidth: number = 1024;
  showPopup: boolean = false;

  constructor(private userService: AuthService, private deviceService: DeviceService) { }

  ngOnInit() {
    this.onResize();
    this.checkUserDevice();
  }

  checkUserDevice() {

    this.deviceService.getUserDevices().subscribe(
      (devices) => {
        if (devices && devices.length > 0) {
          // El usuario tiene dispositivos asociados
          console.log('El usuario tiene dispositivos:', devices);

        } else {
          // El usuario no tiene dispositivos asociados
          console.log('El usuario no tiene dispositivos.');
          this.openDevicePopup();
        }
      },
      (error) => {
        console.error('Error al obtener los dispositivos del usuario:', error);
      }
    );
  }

  openDevicePopup() {
    this.showPopup = true;
  }

  onPopupClose() {
    this.showPopup = false;
    this.checkUserDevice();
    window.location.reload();
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  onSidebarClosed() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    if (typeof window !== 'undefined') {
      this.screenWidth = window.innerWidth;
    }

    if (this.screenWidth < 1024) {
      this.isSidebarOpen = false;
    } else {
      this.isSidebarOpen = true;
    }
  }
}
