import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../Services/cetecory';
import { ProductService } from '../Services/product-service';

@Component({
  selector: 'app-remove-product',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './remove-product.html',
  styleUrls: ['./remove-product.css'],
})
export class RemoveProduct implements OnInit {
  categories: any[] = [];
  products: any[] = [];

  constructor(private categoryService: CategoryService, private productService: ProductService) {}

  ngOnInit() {
    this.loadCategories();
    this.loadProducts();
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (data: any) => {
        this.categories = data.categories || data;
      },
      error: (err) => console.error('❌ Failed to load categories:', err),
    });
  }

  loadProducts() {
    this.productService.getAllProducts().subscribe({
      next: (data: any) => {
        this.products = data.products || data;
      },
      error: (err) => console.error('❌ Failed to load products:', err),
    });
  }

  removeCategory(id: string) {
    if (confirm('Are you sure you want to delete this category?')) {
      this.categoryService.deleteCategory(id).subscribe({
        next: () => {
          this.categories = this.categories.filter((c) => c._id !== id);
          alert('✅ Category deleted successfully');
        },
        error: (err) => console.error('❌ Failed to delete category:', err),
      });
    }
  }

  removeProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(id).subscribe({
        next: () => {
          this.products = this.products.filter((p) => p._id !== id);
          alert('✅ Product deleted successfully');
        },
        error: (err) => console.error('❌ Failed to delete product:', err),
      });
    }
  }

  trackByFn(index: number, item: any) {
    return item._id || index;
  }
}
