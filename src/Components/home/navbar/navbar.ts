import { NgClass, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';

import { ProductService } from '../../Services/product-service';
import { CategoryService } from '../../Services/cetecory';

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

interface CategoryItem {
  _id: string;
  product_id: string;
  name_category: string;
  thumbnail: string;
  __v: number;
  products: ProductItem[];
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterOutlet, NgClass, NgIf, RouterLink, NgFor, FormsModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'], // ✅ fixed plural
})
export class Navbar implements OnInit {
  sidebarOpen = false;
  searchQuery = '';
  selectedCategoryId = '';

  product_categories: ProductItem[] = [];
  categories: CategoryItem[] = [];
  isLoading = false;
  Count_Categories = 0;

  // ✅ For modal editing
  topup = false;
  editedProduct: ProductItem = {
    _id: '',
    product_id: '',
    name_product: '',
    img: '',
    price: 0,
    qty: 0,
    stock: 0,
    dis: '',
    discount: 0,
    category: '',
    amount: 0,
    __v: 0,
    date: '',
  };
  productPreviewUrl: string | null = null;

  constructor(private productService: ProductService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.product_categories = [];
    this.getCategoryCount();
  }

  clearSearch() {
    this.searchQuery = '';
    this.onSearchChange();
  }

  onSearchChange() {
    if (this.searchQuery.trim() === '') {
      this.product_categories = [];
    } else {
      this.searchProductsByName(this.searchQuery);
    }
  }

  loadAllProducts() {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.product_categories = response;
        } else if (response?.products && Array.isArray(response.products)) {
          this.product_categories = response.products;
        } else if (response?.data && Array.isArray(response.data)) {
          this.product_categories = response.data;
        } else {
          this.product_categories = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.isLoading = false;
      },
    });
  }

  searchProductsByName(searchTerm: string) {
    if (searchTerm.trim()) {
      this.isLoading = true;
      this.productService.searchProducts(searchTerm).subscribe({
        next: (response: any) => {
          if (Array.isArray(response)) {
            this.product_categories = response;
          } else if (response?.products && Array.isArray(response.products)) {
            this.product_categories = response.products;
          } else if (response?.data && Array.isArray(response.data)) {
            this.product_categories = response.data;
          } else {
            this.product_categories = [];
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error searching products:', error);
          this.product_categories = [];
          this.isLoading = false;
        },
      });
    }
  }

  get filteredProducts(): ProductItem[] {
    let products = this.product_categories || [];

    if (this.selectedCategoryId) {
      products = products.filter((product) => product?.category === this.selectedCategoryId);
    }

    if (this.searchQuery && !this.isLoading) {
      const term = this.searchQuery.toLowerCase();
      products = products.filter((product) => {
        const name = product?.name_product?.toLowerCase() || '';
        const dis = product?.dis?.toLowerCase() || '';
        const id = product?.product_id?.toLowerCase() || '';
        return name.includes(term) || dis.includes(term) || id.includes(term);
      });
    }

    return products;
  }

  getCategoryCount() {
    this.categoryService.getCategoryCount().subscribe({
      next: (response) => {
        console.log('API Response:', response); // Should be a number like 4
        // ✅ UPDATED: response is the number directly, not response.count
        this.Count_Categories = response;
        console.log('Count set to:', this.Count_Categories);
      },
      error: (error) => {
        console.error('Error fetching category count:', error);
      },
    });
  }

  onImageError(event: any) {
    event.target.src = 'assets/default-product.jpg';
  }

  // ✅ Open product edit modal
  editProduct(_id: string) {
    const found = this.product_categories.find((p) => p._id === _id);
    if (found) {
      this.editedProduct = { ...found };
      this.productPreviewUrl = found.img
        ? found.img.startsWith('http')
          ? found.img
          : 'http://localhost:3000' + found.img
        : 'assets/default-product.jpg';
      this.topup = true;
    }
  }

  editProductModal() {
    this.topup = false;
  }

  // ✅ Handle file input for edit modal
  onProductFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.productPreviewUrl = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  saveProduct() {
    if (!this.editedProduct._id) {
      alert('❌ No product selected for update');
      return;
    }

    const formData = new FormData();
    formData.append('product_id', this.editedProduct.product_id);
    formData.append('name_product', this.editedProduct.name_product);
    formData.append('price', String(this.editedProduct.price));
    formData.append('stock', String(this.editedProduct.stock));
    formData.append('dis', this.editedProduct.dis);
    formData.append('discount', String(this.editedProduct.discount || 0));
    formData.append('qty', String(this.editedProduct.qty || 1));

    // ✅ Add new image if selected
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput?.files && fileInput.files[0]) {
      formData.append('img', fileInput.files[0]); // backend expects "img"
    }

    this.isLoading = true;
    this.productService.updateProduct(this.editedProduct._id, formData).subscribe({
      next: (res) => {
        console.log('✅ Product updated successfully:', res);
        alert('✅ Product updated successfully!');
        this.isLoading = false;
        this.topup = false;

        // 🔄 Update local product list without reload
        const index = this.product_categories.findIndex((p) => p._id === this.editedProduct._id);
        if (index !== -1 && res.product) {
          this.product_categories[index] = res.product;
        }
      },
      error: (err) => {
        console.error('❌ Failed to update product:', err);
        this.isLoading = false;
        alert('❌ Failed to update product: ' + err.message);
      },
    });
    window.location.reload();
  }

  deleteProduct(_id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(_id).subscribe({
        next: () => {
          this.product_categories = this.product_categories.filter((p) => p._id !== _id);
          alert('✅ Product deleted successfully');
        },
        error: (err) => console.error('❌ Failed to delete product:', err),
      });
    }
  }
}
