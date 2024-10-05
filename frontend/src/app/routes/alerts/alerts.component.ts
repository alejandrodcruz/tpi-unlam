import { Component } from '@angular/core';
import { CardInfoComponent } from "../../core/card/card-info.component";
import { FormsModule } from "@angular/forms";
import { AlertsService } from "../../shared/services/alerts.service";

@Component({
  selector: 'app-alerts',
  standalone: true,
  imports: [
    CardInfoComponent,FormsModule,
  ],
  templateUrl: './alerts.component.html',
  styleUrl: './alerts.component.css'
})
export class AlertsComponent {
    alertSettings= {
    excesoConsumo: 300,
    excesoConsumoActivo: false,
    sobretensionActivo: false,
    bajaTensionActivo: false,
    perdidaEnergiaActivo: false,
    picoCorrienteActivo: false,
    temperaturaAltaActivo: false,
    humedadAltaActivo: false,
    dispositivoPerdidoActivo: false
  };

  constructor(private alertService: AlertsService) {}

  onAlertChange() {

    this.alertService.updateAlertSettings(this.alertSettings).subscribe(response => {
      console.log('Configuración de alertas actualizada:', response);
    });
  }
}
