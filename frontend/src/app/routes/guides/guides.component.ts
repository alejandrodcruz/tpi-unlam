import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../../core/sidebar/sidebar.component";
import {PanelTitleComponent} from "../panel-title/panel-title.component";
@Component({
  selector: 'app-guides',
  standalone: true,
  imports: [SidebarComponent, CommonModule, PanelTitleComponent],
  templateUrl: './guides.component.html',
  styleUrl: './guides.component.css'
})
export class GuidesComponent {

}
