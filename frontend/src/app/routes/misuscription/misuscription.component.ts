import { Component } from '@angular/core';

import { CommonModule } from '@angular/common';
import { SidebarComponent } from "../../core/sidebar/sidebar.component";
@Component({
  selector: 'app-misuscription',
  standalone: true,
  imports: [SidebarComponent,CommonModule],
  templateUrl: './misuscription.component.html',
  styleUrl: './misuscription.component.css'
})
export class MisuscriptionComponent {

}