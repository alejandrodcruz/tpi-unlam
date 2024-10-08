import { Component } from '@angular/core';
import {NgClass} from "@angular/common";
import {ConfiguracionService} from "../../shared/services/configuracion.service";

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [
    NgClass
  ],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css'
})
export class ConfiguracionComponent {
  selectedProfile: string | null = null;

  constructor(private configuracionService: ConfiguracionService) {}

  selectProfile(profile: string) {
    this.selectedProfile = profile;
    this.configuracionService.sendProfileSelection(profile).subscribe(response => {
      console.log('Perfil enviado al backend:', profile);
    });
  }
}
