import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatListModule, RouterLink, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']  // Corrige: es "styleUrls", no "styleUrl"
})
export class SidebarComponent {
 @Input() isSidebarOpen = true;  // Recibe el estado desde el componente padre (home)
}
