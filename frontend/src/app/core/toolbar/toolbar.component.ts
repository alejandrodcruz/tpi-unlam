import { Component, EventEmitter, Output } from '@angular/core';
import {RouterLink} from "@angular/router";
import { AuthService } from '../../shared/services/auth.service';


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

  username: string | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.getUser().subscribe((user) => {
      this.username = user.username;
      console.log('User:', this.username);

    });
  }

      notificationCount: number = 5;

      // Método para incrementar las notificaciones
      incrementNotifications() {
        this.notificationCount++;
      }
      @Output() toggleSidebar = new EventEmitter<void>();
}
