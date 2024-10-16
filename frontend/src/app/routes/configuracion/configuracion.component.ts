import {Component, OnInit} from '@angular/core';
import {NgClass} from "@angular/common";

import {RouterLink} from "@angular/router";
import { FormsModule } from "@angular/forms";
import {PanelTitleComponent} from "../panel-title/panel-title.component";
import { ConfigurationService } from '../../shared/services/configuration.service';

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    PanelTitleComponent,
    FormsModule
  ],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css'
})
export class ConfiguracionComponent implements OnInit {
  selectedProfile: string | null = null;
  alertSettings = {
    deviceId: '08:A6:F7:24:71:98',
    highConsumptionValue: 1400,
    highTensionValue: 140,
    lowTensionValue: 120,
    energyLossActive: false,
    peakPowerCurrentValue: 6,
    highTemperatureValue: 50,
    highHumidityValue: 40,
    lostDeviceActive: true,
    highConsumptionActive: true,
    highTensionActive: true,
    lowTensionActive: false,
    peakPowerCurrentActive: false,
    highTemperatureActive: false,
    highHumidityActive: false,
  };

  alertSmallSettings = {
    deviceId: '08:A6:F7:24:71:98',
    highConsumptionValue: 1400,
    highTensionValue: 140,
    lowTensionValue: 120,
    energyLossActive: false,
    peakPowerCurrentValue: 6,
    highTemperatureValue: 50,
    highHumidityValue: 40,
    lostDeviceActive: false,
    highConsumptionActive: false,
    highTensionActive: false,
    lowTensionActive: false,
    peakPowerCurrentActive: false,
    highTemperatureActive: false,
    highHumidityActive: false,
  };

  alertMediumSettings = {
    deviceId: '08:A6:F7:24:71:98',
    highConsumptionValue: 2200,
    highTensionValue: 140,
    lowTensionValue: 120,
    energyLossActive: false,
    peakPowerCurrentValue: 6,
    highTemperatureValue: 50,
    highHumidityValue: 40,
    lostDeviceActive: false,
    highConsumptionActive: false,
    highTensionActive: false,
    lowTensionActive: false,
    peakPowerCurrentActive: false,
    highTemperatureActive: false,
    highHumidityActive: false,
  };

  alertHighSettings = {
    deviceId: '08:A6:F7:24:71:98',
    highConsumptionValue: 3000,
    highTensionValue: 140,
    lowTensionValue: 120,
    energyLossActive: false,
    peakPowerCurrentValue: 6,
    highTemperatureValue: 50,
    highHumidityValue: 40,
    lostDeviceActive: false,
    highConsumptionActive: false,
    highTensionActive: false,
    lowTensionActive: false,
    peakPowerCurrentActive: false,
    highTemperatureActive: false,
    highHumidityActive: false,
  };

  constructor(private configurationService: ConfigurationService) {}

  selectProfile(profile: string) {
    this.selectedProfile = profile;
    switch (profile) {
      case 'small':
        this.alertSettings = this.alertSmallSettings;
        break;
      case 'medium':
        this.alertSettings = this.alertMediumSettings;
        break;
      case 'large':
        this.alertSettings = this.alertHighSettings;
        break;
    }
    this.onAlertChange();
  }

  expanded: { [key: string]: boolean } = {};

  toggleExpand(profile: string, event: Event) {
    event.stopPropagation();
    this.expanded[profile] = !this.expanded[profile];
  }

  ngOnInit(): void {
    const deviceId = this.alertSettings.deviceId;  // Get device Id from session
    this.configurationService.getAlertSettings(deviceId).subscribe((response: { deviceId: string; highConsumptionValue: number; highTensionValue: number; lowTensionValue: number; energyLossActive: boolean; peakPowerCurrentValue: number; highTemperatureValue: number; highHumidityValue: number; lostDeviceActive: boolean; highConsumptionActive: boolean; highTensionActive: boolean; lowTensionActive: boolean; peakPowerCurrentActive: boolean; highTemperatureActive: boolean; highHumidityActive: boolean; }) => {
      this.alertSettings = { ...this.alertSettings, ...response };
    });
  }

  onAlertChange() {
    this.configurationService.updateAlertSettings(this.alertSettings).subscribe((response: any) => {
      console.log('Configuración de alertas actualizada:', response);
    });
  }
}
