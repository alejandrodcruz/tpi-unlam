import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserService, Device } from '../../shared/services/user.service';
import {RouterLink} from "@angular/router";
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import { Observable } from 'rxjs';
import { User } from '../../shared/domain/user';
import { MeasurementsService } from '../../shared/services/measurements.service';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  templateUrl: './toolbar.component.html',
  imports: [
    RouterLink,
    NgForOf,
    NgIf,
    CommonModule,
  ]
})
export class ToolbarComponent implements OnInit {
  isSidebarOpen = true;
  @Output() toggleSidebar = new EventEmitter<void>();

  devices: Device[] = [];
  selectedDevice: string = "";
  deviceName: string = "";
  user$: Observable<User | null>;

  constructor(private userService: UserService, private measurementsService: MeasurementsService) {
    this.user$ = this.userService.user$;
  }

  ngOnInit(): void {
    this.userService.getUserDevices().subscribe((devices) => {
      this.devices = devices;
      this.selectedDevice = devices[0].deviceId
      this.userService.selectDevice(this.selectedDevice);
      this.userService.selectDeviceName(devices[0].name);
      this.deviceName = this.devices.find(device => device.deviceId === this.selectedDevice)?.name || "";
      this.measurementsService.setDeviceId(this.selectedDevice);
    });

    this.userService.getUserData();

  }
  toggleSidebarState() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.toggleSidebar.emit();
  }

  onDeviceChange(event: any) {
    const selectedDevice = event.target.value;
    if (selectedDevice) {
      this.selectedDevice = selectedDevice;
      console.log("selectedDevice", selectedDevice);
      this.userService.selectDevice(selectedDevice);
      this.measurementsService.setDeviceId(selectedDevice);
      this.deviceName = this.devices.find(device => device.deviceId === selectedDevice)?.name || "";
    }
  }

  getFirstLetterInUppercase(name: string | null): string {
    if (!name) return '';
    return name.charAt(0).toUpperCase();
  }
}
