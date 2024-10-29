import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { RouterLink } from "@angular/router";
import { AuthService } from '../../shared/services/auth.service';
import {WebSocketService} from "../../shared/services/web-socket.service";

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [MatListModule, RouterLink, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
   @Input() isSidebarOpen = true;
   @Output() closeSidebar = new EventEmitter<void>();

   constructor(private authService: AuthService, private webSocketService: WebSocketService) { }

    logout() {
        this.webSocketService.disconnect();
        this.authService.logout();
    }

   closeCart() {
      this.isSidebarOpen = false;
      this.closeSidebar.emit();
  }
}
