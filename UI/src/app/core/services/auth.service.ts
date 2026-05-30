import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Result } from '../../shared/models/result';
import { User } from '../../shared/models/user';
import { RegisterRequest } from '../../shared/models/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<Result<User>> {
    return this.http.post<Result<User>>(`${this.apiUrl}/register`, data);
  }

  login(data: any): Observable<Result<User>> {
    return this.http.post<Result<User>>(`${this.apiUrl}/login`, data);
  }

  activate(token: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/activate-account?token=${encodeURIComponent(token)}`, {});
  }
}

