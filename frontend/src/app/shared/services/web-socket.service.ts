import { Injectable } from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService {
  private stompClient: any;
  private alertSubject = new Subject<any>(); // Subject para las alertas

  constructor() {
    this.initConnectionSocket();
  }

  initConnectionSocket() {
    const url = "//localhost:8080/ws";
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);
    this.connect();
  }

  private connect() {
    this.stompClient.connect({}, (frame: any) => {
      console.log('Connected: ' + frame);
      this.stompClient.subscribe('/topic/alerts', (message: any) => {
        this.alertSubject.next(message);
      });
    });
  }

  public listenTopic(): Observable<any> {
    return this.alertSubject.asObservable(); // Devuelve el observable
  }

  public sendAlert(message: string) {
    this.stompClient.send('/app/send-alert', {}, message);
  }
}
