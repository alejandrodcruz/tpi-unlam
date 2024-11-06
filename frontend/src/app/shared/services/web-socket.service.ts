import {Injectable, OnDestroy, OnInit} from '@angular/core';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import {Subject, Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebSocketService implements OnDestroy {
  private stompClient: any;
  private alertSubject = new Subject<any>();
  private consumeSubject = new Subject<any>();
  private measurentsSubject = new Subject<any>();

  constructor() {
    try {
      this.initConnectionSocket();
    }
    catch (error) {
      this.disconnect();
    }
  }

  initConnectionSocket() {
    console.log('Connecting');
    const url = "//localhost:8080/ws";
    const socket = new SockJS(url);
    this.stompClient = Stomp.over(socket);
    this.connectTopics();
  }

  private connectTopics() {
    this.stompClient.connect({}, () => {
      console.log('Connected');
      this.stompClient.subscribe('/topic/alerts', (message: any) => {
        this.alertSubject.next(message);
      });
      this.stompClient.subscribe('/topic/consume', (message: any) => {
        this.consumeSubject.next(message);
      });
      this.stompClient.subscribe('/topic/measurements', (message: any) => {
        this.consumeSubject.next(message);
      });
    });
  }

  public listenAlertsTopic(): Observable<any> {
    try {
      return this.alertSubject.asObservable();
    }
    catch (error) {
      this.disconnect();
      return of(null);
    }
  }

  public listenConsumeTopic(): Observable<any> {
    try {
      return this.consumeSubject.asObservable();
    }
    catch (error) {
      this.disconnect();
      return of(null);
    }
  }

  public listenMeasurentsTopic(): Observable<any> {
    try {
      return this.measurentsSubject.asObservable();
    }
    catch (error) {
      this.disconnect();
      return of(null);
    }
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
