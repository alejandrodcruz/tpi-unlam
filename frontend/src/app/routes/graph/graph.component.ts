import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../shared/services/user.service';
import { AddressService } from '../../shared/services/address.service';
import { AuthService } from '../../shared/services/auth.service';
import { Address } from '../../shared/domain/address';
import { PanelTitleComponent } from "../panel-title/panel-title.component";
import {animate, style, transition, trigger} from "@angular/animations";

class UserNode {
  id: number | undefined
  label: string | undefined
}

class AddressNode {
  id: number | undefined
  city: string | undefined
  street: string | undefined
}

class DeviceNode {
  id: string | undefined
  name: string | undefined
}

@Component({
  selector: 'graphComponent',
  standalone: true,
  imports: [CommonModule, PanelTitleComponent],
  templateUrl: './graph.component.html',
  animations: [
    trigger('fadeIn', [
      transition('void => *', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class GraphComponent implements OnInit {
  username: string = '';
  userNode: UserNode | undefined;
  addressNode: AddressNode[] = [];
  deviceNode: DeviceNode[] = [];
  selectedAddressId: number | undefined;

  constructor(
    private userService: UserService,
    private addressService: AddressService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userId = this.authService.getUserId();
    if (!userId) return;

    this.userService.user$.subscribe((user) => {
      if (!user) return;

      this.username = user.username;

      this.userNode = {
        id: 0,
        label: this.username,
      };

      this.addressService.getAddressesByUser(userId).subscribe((addresses: Address[]) => {
        this.addressNode = addresses.map((address) => ({
          id: address.id,
          city: address.city,
          street: address.street,
        }));
      });
    });
  }


  selectAddres(id: number | undefined) {
    this.selectedAddressId = id;

    this.userService.getUserDevices().subscribe((devices) => {
      this.deviceNode = []
      devices.forEach((device) => {
        if (device.addressId === id) {
          this.deviceNode.push({
            id: device.deviceId,
            name: device.name,
          })
        }
      })
    });
  }
}
