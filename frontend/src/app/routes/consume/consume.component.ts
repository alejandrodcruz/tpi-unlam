import { Component, OnInit } from '@angular/core';
import { CardInfoComponent } from "../../core/card/card-info.component";
import { FormsModule } from "@angular/forms";
import { DatePipe, CommonModule } from "@angular/common";
import { PanelTitleComponent } from "../panel-title/panel-title.component";
import {CardRealTimeComponent} from "../../core/card-real-time/card-real-time.component";
import { Device, UserService } from '../../shared/services/user.service';
import { AuthService } from '../../shared/services/auth.service';
import { ConsumptionService } from '../../shared/services/consumption.service';



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
  userId: number;

  constructor(private userService: UserService, private authService: AuthService,
    private consumptionService: ConsumptionService)
    {
    this.userId = this.authService.getUserId() ?? 0;
    }

  ngOnInit(): void {
    this.userService.getUserDevices().subscribe((devices) => {
      this.devices = devices;
      this.devices.forEach(device => {
        this.consumptionService.getLastDayConsumption(this.userId , device.deviceId).subscribe(value => {
          device.lastDayConsumption = parseFloat(value.toFixed(2));
        });
        this.consumptionService.getCurrentMonthConsumption(this.userId ,device.deviceId).subscribe(value => {
          device.currentMonthConsumption = parseFloat(value.toFixed(2));
        });
        this.consumptionService.getPreviousMonthConsumption(this.userId ,device.deviceId).subscribe(value => {
          device.previousMonthConsumption = parseFloat(value.toFixed(2));
        });
        this.consumptionService.getProjectedCurrentMonthConsumption(this.userId ,device.deviceId).subscribe(value => {
          device.projectedCurrentMonthConsumption = parseFloat(value.toFixed(2));
        });
      });
    });
  }

}
