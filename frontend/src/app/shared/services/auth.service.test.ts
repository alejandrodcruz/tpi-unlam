import { TestBed } from '@angular/core/testing';
import { AuthService, User } from './auth.service';
import { HttpService } from '../utils/httpService';
import { Router } from '@angular/router';
import { of } from 'rxjs';

describe('AuthService', () => {
  let authService: AuthService;
  let httpServiceSpy: jest.Mocked<HttpService>;
  let routerSpy: jest.Mocked<Router>;

  beforeEach(() => {
    httpServiceSpy = {
      post: jest.fn(),
    } as unknown as jest.Mocked<HttpService>;

    routerSpy = {
      navigate: jest.fn(),
    } as unknown as jest.Mocked<Router>;

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpService, useValue: httpServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  it('should login and set token and userId', (done) => {
    const mockResponse = { token: 'testToken', id: 1 };
    httpServiceSpy.post.mockReturnValue(of(mockResponse));

    authService.login('testUser', 'testPass').subscribe(() => {
      expect(authService.getToken()).toBe('testToken');
      expect(authService.getUserId()).toBe(1);
      done();
    });
  });

  it('should register a new user', (done) => {
    const mockUser: User = { username: 'testUser', password: 'testPass', email: 'test@example.com' };
    const mockResponse = { id: 1, ...mockUser };
    httpServiceSpy.post.mockReturnValue(of(mockResponse));

    authService.register(mockUser).subscribe((response) => {
      expect(response).toEqual(mockResponse);
      done();
    });
  });

  it('should logout and clear token and userId', () => {
    authService.logout();
    expect(authService.getToken()).toBeNull();
    expect(authService.getUserId()).toBeNull();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should return null if no token in storage', () => {
    localStorage.removeItem('token');
    expect(authService.getToken()).toBeNull();
  });

  it('should return null if no userId in storage', () => {
    localStorage.removeItem('userId');
    expect(authService.getUserId()).toBeNull();
  });
});
