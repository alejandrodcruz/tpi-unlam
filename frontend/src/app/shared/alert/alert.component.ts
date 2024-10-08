import { Component } from '@angular/core';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { WebSocketService } from '../services/web-socket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, ToastrModule],
  template: ``,
})
export class AlertComponent {
  constructor(private webSocketService: WebSocketService, private toast: ToastrService) {
    this.webSocketService.listenTopic().subscribe((message: any) => {
      console.log("Nueva alerta" + message);
      this.toast.error(message.body, 'Alerta');
    });
  }
}
