import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {AuthService, User} from "./auth.service";
import {TestBed} from "@angular/core/testing";

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should login successfully and store token and userId', () => {
    const mockResponse = { token: '12345', id: 1 };
    service.login('testuser', 'password').subscribe(response => {
      expect(response.token).toBe('12345');
      expect(service.getToken()).toBe('12345');
      expect(service.getUserId()).toBe(1);
    });

    const req = httpMock.expectOne('http://lytics.dyndns.org:8080/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should register a new user successfully', () => {
    const mockUser: User = { username: 'newuser', password: 'password', email: 'newuser@example.com' };
    const mockResponse = { message: 'User registered successfully' };

    service.register(mockUser).subscribe(response => {
      expect(response.message).toBe('User registered successfully');
    });

    const req = httpMock.expectOne('http://lytics.dyndns.org:8080/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should clear token and userId on logout', () => {
    service.logout();
    expect(service.getToken()).toBeNull();
    expect(service.getUserId()).toBeNull();
  });

  it('should return null if no token is stored', () => {
    localStorage.removeItem('token');
    expect(service.getToken()).toBeNull();
  });

  it('should return null if no userId is stored', () => {
    localStorage.removeItem('userId');
    expect(service.getUserId()).toBeNull();
  });

  it('should handle login failure', () => {
    service.login('testuser', 'wrongpassword').subscribe(
      () => fail('expected an error, not a response'),
      error => expect(error.status).toBe(401)
    );

    const req = httpMock.expectOne('http://lytics.dyndns.org:8080/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
  });

  it('should handle registration failure', () => {
    const mockUser: User = { username: 'newuser', password: 'password', email: 'newuser@example.com' };

    service.register(mockUser).subscribe(
      () => fail('expected an error, not a response'),
      error => expect(error.status).toBe(400)
    );

    const req = httpMock.expectOne('http://lytics.dyndns.org:8080/auth/register');
    expect(req.request.method).toBe('POST');
    req.flush({ message: 'Bad Request' }, { status: 400, statusText: 'Bad Request' });
  });
});

