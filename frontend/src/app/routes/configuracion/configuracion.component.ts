import {Component, OnInit} from '@angular/core';
import {NgClass} from "@angular/common";
import {ConfiguracionService} from "../../shared/services/configuracion.service";
import {RouterLink} from "@angular/router";
import {PanelTitleComponent} from "../panel-title/panel-title.component";

@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [
    NgClass,
    RouterLink,
    PanelTitleComponent
  ],
  templateUrl: './configuracion.component.html',
  styleUrl: './configuracion.component.css'
})
export class ConfiguracionComponent implements OnInit{
  selectedProfile: string | null = null;

  constructor(private configuracionService: ConfiguracionService) {}

  selectProfile(profile: string) {
    this.selectedProfile = profile;
    this.configuracionService.sendProfileSelection(profile).subscribe(response => {
      console.log('Perfil enviado al backend:', profile);
    });
  }
  expanded: { [key: string]: boolean } = {};
  expandedCard: string | null = null;
  expandedProfile: string | null = null;
  toggleExpand(profile: string, event: Event): void {
    event.preventDefault();

    if (this.expandedProfile === profile) {
      this.expandedProfile = null;
    } else {
      this.expandedProfile = profile;
    }
  }

  ngOnInit(): void {
    this.configuracionService.getStoredProfile().subscribe(
      data => {
        this.selectedProfile = data.profile;
        console.log("Perfil almacenado: ", this.selectedProfile);
      },
      error => {
        console.error("Error al obtener el perfil almacenado", error);
      }
    );
  }
}


