import { Component, HostListener, OnInit } from '@angular/core';
import { RouterLink, RouterModule } from '@angular/router';
import { SidebarComponent } from '../../core/sidebar/sidebar.component';
import { ToolbarComponent } from '../../core/toolbar/toolbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, SidebarComponent, ToolbarComponent, CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isSidebarOpen = true;
  screenWidth: number = window.innerWidth;

  ngOnInit() {
    this.onResize();  // Aseguramos que el estado inicial dependa del tamaño de la pantalla
  }

  // Método para alternar el estado del sidebar manualmente
  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  // Detectar cuando cambia el tamaño de la pantalla
  @HostListener('window:resize', ['$event'])
  onResize() {
    if (typeof window !== 'undefined') {
      this.screenWidth = window.innerWidth;  // Actualiza el ancho de pantalla si estamos en el navegador
    }

    if (this.screenWidth < 1024) {
      this.isSidebarOpen = false;
    } else {
      this.isSidebarOpen = true;
    }
  }
}
