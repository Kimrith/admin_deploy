import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface UserItem {
  _id: string;
  name_user: string;
  phone_number: string;
  email: string;
  password: string;
  address: string;
  date: string;
  profile_img?: string;
  __v?: number;
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly baseUrl = 'http://localhost:3000/api/login';

  constructor(private http: HttpClient) {}

  // ✅ Get all users
  getAllUsers(): Observable<UserItem[]> {
    return this.http.get<UserItem[]>(this.baseUrl);
  }

  // ✅ Delete user
  deleteUser(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }

  // updateUser(id: string): Observable<any> {
  //   return this.http.put(`${this.baseUrl}/cancel/${id}`, {});
  // }

  updateUser(id: string, data: Partial<UserItem>): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data);
  }
}
