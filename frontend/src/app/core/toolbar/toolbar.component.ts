import { Component, EventEmitter, Output } from '@angular/core';
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {

  @Output() toggleSidebar = new EventEmitter<void>();
  constructor() {}

  ngOnInit() {
  }

      notificationCount: number = 5;

      // Método para incrementar las notificaciones
      incrementNotifications() {
        this.notificationCount++;
      }

}
