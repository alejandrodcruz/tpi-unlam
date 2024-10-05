import { Component } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { SidebarComponent } from '../../core/sidebar/sidebar.component';
import { ToolbarComponent } from '../../core/toolbar/toolbar.component';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule,
    SidebarComponent,
    ToolbarComponent,
    CommonModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  isSidebarOpen = true;

  // Método para alternar el estado del sidebar
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
}
