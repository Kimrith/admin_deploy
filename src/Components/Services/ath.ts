import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private API_URL = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  // ======================
  // ADMIN (PUBLIC)
  // ======================

  registerAdmin(data: FormData): Observable<any> {
    return this.http.post(`${this.API_URL}/admin/register`, data);
  }

  adminLogin(payload: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.API_URL}/admin/login`, payload);
  }

  // 🔐 VERIFY OLD PASSWORD (JWT)
  verifyAdminPassword(password: string): Observable<any> {
    return this.http.post(
      `${this.API_URL}/admin/verify-password`,
      { password },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
        },
      }
    );
  }

  // ======================
  // ADMIN (PROTECTED)
  // ======================

  // ✅ CURRENT ADMIN
  getCurrentAdmin(): Observable<any> {
    return this.http.get(`${this.API_URL}/admin/me`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
  }

  // ✅ UPDATE CURRENT ADMIN
  updateProfile(data: FormData): Observable<any> {
    return this.http.put(`${this.API_URL}/admin/me`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
  }
}
