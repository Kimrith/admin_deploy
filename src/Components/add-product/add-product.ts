import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { CategoryService } from '../Services/cetecory';
import { ProductService } from '../Services/product-service'; // ✅ Import ProductService

@Component({
  selector: 'app-post-category',
  standalone: true,
  imports: [FormsModule, CommonModule, NgFor],
  templateUrl: './add-product.html',
})
export class AddProduct implements OnInit {
  // 🟦 Category fields
  categoryName: string = '';
  selectedFile: File | null = null;
  previewUrl: string | ArrayBuffer | null = null;
  categories: any[] = [];

  // 🟨 Product modal fields
  topUp: boolean = false;
  selectedCategoryId: string = '';
  selectedProductFile: File | null = null;

  // 🧩 Product form model
  product = {
    product_id: '',
    name_product: '',
    price: 0,
    qty: 0,
    stock: 0,
    discount: 0,
    dis: '',
  };

  constructor(
    private categoryService: CategoryService,
    private productService: ProductService // ✅ Inject ProductService
  ) {}

  ngOnInit() {
    this.Getapi();
  }

  // ✅ Handle category image
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    if (file.size > 1000000) {
      alert('⚠️ File is too large. Please upload an image under 1MB.');
      this.selectedFile = null;
      this.previewUrl = null;
      return;
    }

    this.selectedFile = file;
    const reader = new FileReader();
    reader.onload = () => (this.previewUrl = reader.result);
    reader.readAsDataURL(file);
  }

  // ✅ Create new category
  onSubmit() {
    if (!this.categoryName.trim()) {
      alert('⚠️ Please enter a category name!');
      return;
    }

    const formData = new FormData();
    formData.append('name_category', this.categoryName);
    if (this.selectedFile) {
      formData.append('thumbnail', this.selectedFile);
    }

    this.categoryService.addCategory(formData).subscribe({
      next: (res) => {
        alert('🎉 Category created successfully!');
        this.categoryName = '';
        this.selectedFile = null;
        this.previewUrl = null;
        this.Getapi();
      },
      error: (err) => {
        console.error('❌ Error posting category:', err);
        alert('❌ Failed to create category.');
      },
    });
  }

  // ✅ Get all categories
  Getapi() {
    this.categoryService.getAllCategories().subscribe({
      next: (data: any) => {
        this.categories = data.categories || data;
      },
      error: (err) => {
        console.error('❌ Failed to fetch categories:', err);
      },
    });
  }

  // ✅ Open popup and store category ID
  PostProduct(categoryId: string) {
    this.selectedCategoryId = categoryId;
    this.topUp = true;
  }

  // ✅ Handle file upload inside popup
  onProductFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    if (file.size > 1000000) {
      alert('⚠️ File too large. Please upload an image under 1MB.');
      return;
    }
    this.selectedProductFile = file;
  }

  // ✅ Post Product to API
  postproduct_catecories() {
    if (!this.product.name_product.trim()) {
      alert('⚠️ Product name required!');
      return;
    }

    const formData = new FormData();
    formData.append('name_product', this.product.name_product);
    formData.append('product_id', this.product.product_id);
    formData.append('price', this.product.price.toString());
    formData.append('qty', this.product.qty.toString());
    formData.append('stock', this.product.stock.toString());
    formData.append('discount', this.product.discount.toString());
    formData.append('dis', this.product.dis);
    if (this.selectedProductFile) formData.append('thumbnail', this.selectedProductFile);

    // ✅ Call Product API
    this.productService.addProduct(this.selectedCategoryId, formData).subscribe({
      next: (res) => {
        alert('✅ Product created successfully!');
        this.topUp = false;
        this.product = {
          product_id: '',
          name_product: '',
          price: 0,
          qty: 0,
          stock: 0,
          discount: 0,
          dis: '',
        };
        this.selectedProductFile = null;
      },
      error: (err) => {
        console.error('❌ Failed to post product:', err);
        alert('❌ Failed to post product.');
      },
    });
  }
}
