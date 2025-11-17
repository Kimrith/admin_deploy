import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface ProductItem {
  _id: string;
  product_id: string;
  name_product: string;
  img: string;
  price: number;
  qty: number;
  stock: number;
  dis: string;
  discount: number;
  category: string;
  amount: number;
  __v: number;
  date: string;
}

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private baseUrl = 'http://localhost:3000/api/product';

  constructor(private http: HttpClient) {}

  // Fetch all products
  getAllProducts(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  // Fetch products by category
  getProductsByCategory(categoryId: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/category/${categoryId}`);
  }

  // Search products - Try different endpoint patterns
  searchProducts(searchTerm: string): Observable<any> {
    // Try 1: Standard search endpoint
    // return this.http.get<any>(`${this.baseUrl}/search?q=${encodeURIComponent(searchTerm)}`);

    // Try 2: Query parameter search
    // return this.http.get<any>(`${this.baseUrl}?q=${encodeURIComponent(searchTerm)}`);

    // Try 3: Name-based search (most likely to work with your data)
    return this.http.get<any>(`${this.baseUrl}?name=${encodeURIComponent(searchTerm)}`);
  }

  // Alternative search methods you can try:

  // Method 1: Search by name_product field
  searchByName(searchTerm: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?name_product=${encodeURIComponent(searchTerm)}`);
  }

  // Method 2: Generic search with multiple parameters
  searchGeneric(searchTerm: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}?search=${encodeURIComponent(searchTerm)}`);
  }

  // ✅ Create new product under a specific category
  addProduct(categoryId: string, formData: FormData): Observable<any> {
    // Assuming your backend route looks like POST /api/product/:categoryId
    return this.http.post<any>(`${this.baseUrl}/${categoryId}`, formData);
  }

  updateProduct(id: string, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, formData);
  }

  deleteProduct(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
