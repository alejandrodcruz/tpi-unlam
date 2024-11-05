import {Component, OnInit} from '@angular/core';
import {NgClass} from "@angular/common";
import { ActivatedRoute } from '@angular/router';
import {RouterLink} from "@angular/router";
import { FormsModule } from "@angular/forms";
import {PanelTitleComponent} from "../panel-title/panel-title.component";
import { ConfigurationService } from '../../shared/services/configuration.service';
import {UserService} from "../../shared/services/user.service";

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
  deviceSelectId: string | null = null;
  public deviceId: string = '';
  public deviceName: string = '';
  public title: string = '';
  alertSettings = {
    deviceId: this.deviceId,
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

  alertSmallSettings = {
    deviceId: this.deviceId,
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
    deviceId: this.deviceId,
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
    deviceId: this.deviceId,
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

  constructor(private route: ActivatedRoute,
              private configurationService: ConfigurationService,
              private userService: UserService) {}

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
    // Obtiene el deviceId desde el parámetro de la URL
    this.deviceSelectId = this.route.snapshot.paramMap.get('deviceId') || '';
    console.log('Device ID desde URL:', this.deviceSelectId);

    // Establece el título con el deviceId
    this.title = "Selecciona la configuración para " + this.deviceSelectId;

    // Carga las configuraciones del dispositivo usando el deviceId
    this.configurationService.getAlertSettings(this.deviceSelectId).subscribe((response) => {
      this.alertSettings = { ...this.alertSettings, ...response };
      console.log("Configuración cargada para el dispositivo:", this.alertSettings);
    });
  }

  onAlertChange() {
    this.alertSettings.deviceId = this.deviceSelectId || '';  // Asegúrate de usar deviceSelectId
    this.configurationService.updateAlertSettings(this.alertSettings).subscribe((response: any) => {
      console.log('Configuración de alertas actualizada:', response);
    });
  }
}
