import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {UserService, Device } from '../../shared/services/user.service';
import {RouterLink} from "@angular/router";
import {CommonModule, NgForOf, NgIf} from "@angular/common";
import { MeasurementsService } from '../../shared/services/measurements.service';
import { AddressService } from '../../shared/services/address.service';
import { Address } from '../../shared/domain/address';
import { AuthService } from '../../shared/services/auth.service';
import { Observable } from 'rxjs';
import { User } from '../../shared/domain/user';
import { ToastrService } from 'ngx-toastr';

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
  addresses: Address[] = [];

  addressTypeOptions = [
    { value: 'HOME', label: 'Casa' },
    { value: 'BUSINESS', label: 'Negocio' },
    { value: 'WORKSHOP', label: 'Taller' }
  ];

  constructor(private userService: UserService,
              private measurementsService: MeasurementsService,
              private addressService: AddressService,
              private authService: AuthService,
              private toast: ToastrService)
              {this.user$ = this.userService.user$;}

  ngOnInit(): void {
    this.userService.getUserDevices().subscribe((devices) => {
      this.devices = devices;
      this.selectedDevice = devices[0].deviceId
      this.userService.selectDevice(this.selectedDevice);
      this.userService.selectDeviceName(devices[0].name);
      this.deviceName = this.devices.find(device => device.deviceId === this.selectedDevice)?.name || "";
      this.measurementsService.setDeviceId(this.selectedDevice);
    });
    const userId = this.authService.getUserId();
    if (userId !== null) {
    this.addressService.getAddressesByUser(userId).subscribe((addresses) => {
      this.addresses = addresses;
    });
    } else {
      this.toast.warning("No cuentas con user activo.");
      this.authService.logout();
    }

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

  getAddressTypeLabel(type: string): string {
    const option = this.addressTypeOptions.find(opt => opt.value === type);
    return option ? option.label : type;
  }
}
