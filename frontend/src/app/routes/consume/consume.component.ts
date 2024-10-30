import { Component, OnInit } from '@angular/core';
import { CardInfoComponent } from "../../core/card/card-info.component";
import { FormsModule } from "@angular/forms";
import { DatePipe, CommonModule } from "@angular/common";
import { PanelTitleComponent } from "../panel-title/panel-title.component";
import {CardRealTimeComponent} from "../../core/card-real-time/card-real-time.component";
import { Device, UserService } from '../../shared/services/user.service';



@Component({
  selector: 'consume',
  standalone: true,
  imports: [
    CommonModule,
    CardInfoComponent,
    FormsModule,
    DatePipe,
    PanelTitleComponent,
    CardRealTimeComponent
  ],
  templateUrl: './consume.component.html'
})
export class ConsumeComponent implements OnInit {
  devices: Device[] = [];

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUserDevices().subscribe((devices) => {
      this.devices = devices;
      //test
      this.devices.forEach(device => {
        this.userService.getLastDayConsumption(device.deviceId).subscribe(value => {
          device.lastDayConsumption = value;
        });
        this.userService.getCurrentMonthConsumption(device.deviceId).subscribe(value => {
          device.currentMonthConsumption = value;
        });
        this.userService.getPreviousMonthConsumption(device.deviceId).subscribe(value => {
          device.previousMonthConsumption = value;
        });
        this.userService.getProjectedCurrentMonthConsumption(device.deviceId).subscribe(value => {
          device.projectedCurrentMonthConsumption = value;
        });
      });
      //test
    });
  }

}
