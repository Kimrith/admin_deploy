import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CategoryItem {
  _id: string;
  name_category: string;
  thumbnail: string;
  products: ProductItem[];
}

export interface ProductItem {
  _id: string;
  name_product: string;
  price: number;
  qty: number;
  stock: number;
  dis: string;
  discount: number;
  category: string;
  amount: number;
  date: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private baseUrl = 'http://localhost:3000/api/cetecory';
  private getCountUrl = `${this.baseUrl}/count`;

  constructor(private http: HttpClient) {}

  // ✅ Fetch all categories
  getAllCategories(): Observable<CategoryItem[]> {
    return this.http.get<CategoryItem[]>(this.baseUrl);
  }

  // ✅ Get one category
  getCategoryById(categoryId: string): Observable<CategoryItem> {
    return this.http.get<CategoryItem>(`${this.baseUrl}/${categoryId}`);
  }

  // ✅ Count categories
  getCategoryCount(): Observable<number> {
    return this.http.get<number>(this.getCountUrl);
  }

  addCategory(formData: FormData): Observable<any> {
    return this.http.post<any>(this.baseUrl, formData);
  }

  updateCategory(categoryId: string, formData: FormData): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${categoryId}`, formData);
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
