import { Component } from '@angular/core';


@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.css',
})
export class ToolbarComponent {
      notificationCount: number = 5;

      // Método para incrementar las notificaciones
      incrementNotifications() {
        this.notificationCount++;
      }
}
