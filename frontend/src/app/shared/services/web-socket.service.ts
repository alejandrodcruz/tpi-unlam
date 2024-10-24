import {Injectable, OnDestroy, OnInit} from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {Subject, Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnInit, OnDestroy {
  private stompClient: any;
  private alertSubject = new Subject<any>();

  constructor() {}

  ngOnInit(): void {
    try {
      this.initConnectionSocket();
    }
    catch (error) {
      this.disconnect();
    }
  }

  initConnectionSocket() {
    const url = "//localhost:8080/ws";
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);
    this.connect();
  }

  private connect() {
    this.stompClient.connect({}, (frame: any) => {
      this.stompClient.subscribe('/topic/alerts', (message: any) => {
        this.alertSubject.next(message);
      });
    });
  }

  public listenTopic(): Observable<any> {
    try {
      return this.alertSubject.asObservable();
    }
    catch (error) {
      this.disconnect();
      return of(null);
    }
  }

  public sendAlert(message: string) {
    this.stompClient.send('/app/send-alert', {}, message);
  }

  public disconnect() {
    if (this.stompClient && this.stompClient.connected) {
      this.stompClient.disconnect(() => {
        console.log('Disconnected');
      });
    }
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
