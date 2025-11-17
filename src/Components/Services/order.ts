import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private baseUrl = 'http://localhost:3000/api/order';

  constructor(private http: HttpClient) {}

  // Get all orders
  getAllOrders(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  // Get pending orders
  getPending(): Observable<any> {
    return this.http.get(`${this.baseUrl}/pending`);
  }

  // Confirm an order
  confirmOrder(id: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/confirm/${id}`, {});
  }

  // Cancel an order
  cancelOrder(id: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/cancel/${id}`, {});
  }

  deleteOrder(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
