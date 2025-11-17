import { Component, OnInit, signal } from '@angular/core';
import { CategoryService } from '../Services/cetecory';
import { NgFor, NgIf } from '@angular/common';
import { ProductService } from '../Services/product-service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-product',
  standalone: true,
  imports: [NgFor, NgIf, FormsModule],
  templateUrl: './update-product.html',
  styleUrls: ['./update-product.css'],
})
export class UpdateProduct implements OnInit {
  categories: any[] = [];
  products = signal<any[]>([]);

  topup = false;
  editProductModal = false;

  editedProduct: any = {
    _id: '',
    name_product: '',
    price: 0,
    img: '',
  };

  editedCategory: any = {
    _id: '',
    name_category: '',
    thumbnail: '',
  };

  previewUrl: string | ArrayBuffer | null = null;
  productPreviewUrl: string | ArrayBuffer | null = null;

  constructor(private categoryService: CategoryService, private productService: ProductService) {}

  ngOnInit() {
    this.LoadApiCategory();
    this.LoadApiProduct();
  }

  LoadApiCategory() {
    this.categoryService.getAllCategories().subscribe({
      next: (data: any) => {
        this.categories = data.categories || data;
      },
      error: (err) => console.error('❌ Failed to load categories:', err),
    });
  }

  LoadApiProduct() {
    this.productService.getAllProducts().subscribe({
      next: (data: any) => {
        this.products.set(data.products || data);
      },
      error: (err) => console.error('❌ Failed to load products:', err),
    });
  }

  /* ---------------- CATEGORY FUNCTIONS ---------------- */

  editCategory(id: string) {
    const category = this.categories.find((c) => c._id === id);
    if (category) {
      this.editedCategory = { ...category };
      this.previewUrl = category.thumbnail;
      this.topup = true;
    }
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.editedCategory.thumbnail = file;

      const reader = new FileReader();
      reader.onload = (e) => (this.previewUrl = e.target?.result || null);
      reader.readAsDataURL(file);
    }
  }

  saveCategory() {
    if (!this.editedCategory._id) return;

    const formData = new FormData();
    formData.append('name_category', this.editedCategory.name_category);

    if (this.editedCategory.thumbnail instanceof File) {
      formData.append('thumbnail', this.editedCategory.thumbnail);
    }

    this.categoryService.updateCategory(this.editedCategory._id, formData).subscribe({
      next: () => {
        alert('✅ Category updated successfully!');
        this.LoadApiCategory();
        this.topup = false;
      },
      error: (err) => console.error('❌ Failed to update category:', err),
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

  /* ---------------- PRODUCT FUNCTIONS ---------------- */

  editProduct(product: any) {
    this.editedProduct = { ...product };

    this.productPreviewUrl = product.img
      ? product.img.startsWith('http')
        ? product.img
        : 'http://localhost:3000' + product.img
      : 'assets/default-product.jpg';

    this.editProductModal = true;
  }

  onProductFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.editedProduct.img = file;

      const reader = new FileReader();
      reader.onload = (e) => (this.productPreviewUrl = e.target?.result || null);
      reader.readAsDataURL(file);
    }
  }

  saveProduct() {
    if (!this.editedProduct._id) return;

    const formData = new FormData();
    formData.append('name_product', this.editedProduct.name_product);
    formData.append('price', this.editedProduct.price);
    formData.append('dis', this.editedProduct.dis || '');
    formData.append('stock', this.editedProduct.stock);

    if (this.editedProduct.img instanceof File) {
      formData.append('img', this.editedProduct.img);
    }

    this.productService.updateProduct(this.editedProduct._id, formData).subscribe({
      next: () => {
        alert('✅ Product updated successfully!');
        this.LoadApiProduct();
        this.editProductModal = false;
      },
      error: (err) => console.error('❌ Failed to update product:', err),
    });
  }

  removeProduct(id: string) {
    if (!confirm('Are you sure want to delete this product?')) return;

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.products.update((list) => list.filter((p) => p._id !== id));
        alert('✅ Product deleted successfully!');
      },
      error: (err) => {
        console.error('❌ Failed to delete product:', err);
        alert('Failed to delete product. Please try again.');
      },
    });
  }

  trackByFn(index: number, item: any): any {
    return item._id || item.product_id || index;
  }

  onImgError(event: any) {
    event.target.src = 'assets/default-product.jpg';
  }
}
