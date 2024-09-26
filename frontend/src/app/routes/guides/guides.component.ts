import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import {SidebarComponent} from "../sidebar/sidebar.component";
@Component({
  selector: 'app-guides',
  standalone: true,
  imports: [SidebarComponent,CommonModule],
  templateUrl: './guides.component.html',
  styleUrl: './guides.component.css'
})
export class GuidesComponent {

}
