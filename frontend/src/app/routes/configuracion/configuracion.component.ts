import { Component, OnInit } from '@angular/core';
import { NgClass } from "@angular/common";
import { ConfigurationService } from "../../shared/services/configuration.service";
import { RouterLink } from "@angular/router";
import { FormsModule } from "@angular/forms";

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
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

  constructor(private configurationService: ConfigurationService) {}

  selectProfile(profile: string) {
    this.selectedProfile = profile;
    /*
    this.configurationService.sendProfileSelection(profile).subscribe(response => {
      console.log('Perfil enviado al backend:', profile);
    });
    */
  }
  expanded: { [key: string]: boolean } = {};
  expandedCard: string | null = null;

  toggleExpand(profile: string, event: Event) {
    event.stopPropagation();
    this.expanded[profile] = !this.expanded[profile];
  }

  ngOnInit(): void {
    const deviceId = this.alertSettings.deviceId;  // Get device Id from session
    this.configurationService.getAlertSettings(deviceId).subscribe(response => {
      this.alertSettings = { ...this.alertSettings, ...response };
    });
  }

  onAlertChange() {
    this.configurationService.updateAlertSettings(this.alertSettings).subscribe(response => {
      console.log('Configuración de alertas actualizada:', response);
    });
  }
}
