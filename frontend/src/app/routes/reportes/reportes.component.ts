import { Component } from '@angular/core';
import {SidebarComponent} from "../../core/sidebar/sidebar.component";

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [
    SidebarComponent
  ],
  templateUrl: './reportes.component.html',
  styleUrl: './reportes.component.css'
})
export class ReportesComponent {

}
