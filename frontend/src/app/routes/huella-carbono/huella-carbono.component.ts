import { Component } from '@angular/core';
import {SidebarComponent} from "../../core/sidebar/sidebar.component";
import { CardInfoComponent } from '../../core/card/card-info.component';

@Component({
  selector: 'app-huella-carbono',
  standalone: true,
  imports: [CardInfoComponent, SidebarComponent],
  templateUrl: './huella-carbono.component.html',
  styleUrl: './huella-carbono.component.css'
})
export class HuellaCarbonoComponent {

}
