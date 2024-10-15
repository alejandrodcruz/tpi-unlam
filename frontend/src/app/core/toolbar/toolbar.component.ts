import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {
  isSidebarOpen = true;
  @Output() toggleSidebar = new EventEmitter<void>();
  constructor() {}

  toggleSidebarState() {
    this.isSidebarOpen = !this.isSidebarOpen;
    this.toggleSidebar.emit();
  }

  ngOnInit() {
  }

      notificationCount: number = 5;

      // Método para incrementar las notificaciones
      incrementNotifications() {
        this.notificationCount++;
      }

}
