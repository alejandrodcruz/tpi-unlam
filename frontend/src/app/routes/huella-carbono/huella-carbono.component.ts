import { Component } from '@angular/core';
import {CardInfoComponent} from "../../core/components/card/card-info/card-info.component";
import {SidebarComponent} from "../../core/sidebar/sidebar.component";

@Component({
  selector: 'app-huella-carbono',
  standalone: true,
  imports: [CardInfoComponent, SidebarComponent],
  templateUrl: './huella-carbono.component.html',
  styleUrl: './huella-carbono.component.css'
})
export class HuellaCarbonoComponent {

}
