import { Component, HostListener, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SidebarComponent } from '../../core/sidebar/sidebar.component';
import { ToolbarComponent } from '../../core/toolbar/toolbar.component';
import { CommonModule } from '@angular/common';
import {AlertsComponent} from "../alerts/alerts.component";
import {AlertComponent} from "../../shared/alert/alert.component";
import { User, UserService } from '../../shared/services/user.service';
import { DevicePopupComponent } from '../../core/device-popup/device-popup.component';

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

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.onResize();

    this.checkUserDevice();
  }
  checkUserDevice() {
    this.userService.getUser().subscribe(
      (user: User) => {
        if (!user.hasDevice) {
          this.openDevicePopup();
        }
      },
      (error) => {
        console.error('Error al obtener el usuario:', error);
      }
    );
  }

  openDevicePopup() {
    this.showPopup = true;
  }

  onPopupClose() {
    this.showPopup = false;
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
