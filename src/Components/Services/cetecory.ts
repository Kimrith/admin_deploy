import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

interface CategoryItem {
  _id: string;
  product_id: string;
  name_category: string;
  thumbnail: string;
  __v: number;
  products: ProductItem[];
}

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
export class CategoryService {
  private baseUrl = 'http://localhost:3000/api/cetecory'; // ✅ Using your actual API endpoint: cetecory
  private getCountUrl = 'http://localhost:3000/api/cetecory/count';
  constructor(private http: HttpClient) {}

  // Fetch all categories
  getAllCategories(): Observable<any> {
    return this.http.get<any>(this.baseUrl);
  }

  // Get category by ID
  getCategoryById(categoryId: string): Observable<CategoryItem> {
    return this.http.get<CategoryItem>(`${this.baseUrl}/${categoryId}`); // ✅ Using cetecory
  }

  // ✅ UPDATED: API returns a number directly, not an object
  getCategoryCount(): Observable<number> {
    return this.http.get<number>(this.getCountUrl);
  }
}
