import {Component, OnDestroy, OnInit} from '@angular/core';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { WebSocketService } from '../services/web-socket.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule, ToastrModule],
  template: ``,
})
export class AlertComponent implements OnInit {
  constructor(private webSocketService: WebSocketService, private toast: ToastrService) {}

  ngOnInit(): void {
    this.webSocketService.listenTopic().subscribe(message => {
      this.toast.error(message.body, 'Alerta');
    });
  }

}
