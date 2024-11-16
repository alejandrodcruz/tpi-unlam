import { TestBed } from '@angular/core/testing';
import { WebSocketService } from './web-socket.service';
import { Subject, Observable, of } from 'rxjs';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';

jest.mock('sockjs-client');
jest.mock('@stomp/stompjs', () => ({
  Stomp: {
    over: jest.fn().mockReturnValue({
      connect: jest.fn(),
      subscribe: jest.fn(),
      send: jest.fn(),
      disconnect: jest.fn((callback: Function) => callback()),
      connected: true,
    }),
  },
}));

describe('WebSocketService', () => {
  let service: WebSocketService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WebSocketService],
    });
    service = TestBed.inject(WebSocketService);
    jest.spyOn(console, 'log').mockImplementation(() => {}); // Mock de console.log para evitar errores en el test
  });

  afterEach(() => {
    jest.clearAllMocks();
    service.disconnect();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should initialize WebSocket connection', () => {
    service.initConnectionSocket();
    expect(console.log).toHaveBeenCalledWith('Connecting');
    expect(Stomp.over).toHaveBeenCalled();
  });

  it('should connect and subscribe to a topic', () => {
    (service as any).stompClient.connect({}, (frame: any) => {
      console.log('Connected');
    });
    (service as any).stompClient.subscribe('/topic/alerts', jest.fn());

    service.initConnectionSocket();
    expect(console.log).toHaveBeenCalledWith('Connecting');
  });

  it('should send a message to the specified topic', () => {
    service.sendAlert('Test Alert');
    expect((service as any).stompClient.send).toHaveBeenCalledWith('/app/send-alert', {}, 'Test Alert');
  });

  it('should disconnect the WebSocket connection', () => {
    service.disconnect();
    expect(console.log).toHaveBeenCalledWith('Disconnected');
    expect((service as any).stompClient.disconnect).toHaveBeenCalledWith(expect.any(Function));
  });

  it('should return an observable from listenTopic', () => {
    const observable = service.listenTopic();
    expect(observable).toBeInstanceOf(Observable);
  });

});
