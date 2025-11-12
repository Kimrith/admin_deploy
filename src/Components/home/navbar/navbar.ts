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
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit {
  sidebarOpen: boolean = false;
  searchQuery: string = '';
  selectedCategoryId: string = '';

  product_categories: ProductItem[] = [];
  categories: CategoryItem[] = [];
  isLoading: boolean = false;
  Count_Categories: number = 0;

  constructor(private productService: ProductService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    // Load all products when component initializes
    // this.loadAllProducts();
    this.product_categories = [];
    this.getCategoryCount();
  }

  clearSearch() {
    this.searchQuery = '';
    this.onSearchChange();
  }

  onSearchChange() {
    if (this.searchQuery.trim() === '') {
      // If search is empty, clear results
      this.product_categories = [];
    } else {
      // If search is not empty, search products by name
      this.searchProductsByName(this.searchQuery);
    }
  }

  // Method to load all products
  loadAllProducts() {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (response: any) => {
        if (Array.isArray(response)) {
          this.product_categories = response;
        } else if (response && response.products && Array.isArray(response.products)) {
          this.product_categories = response.products;
        } else if (response && response.data && Array.isArray(response.data)) {
          this.product_categories = response.data;
        } else {
          this.product_categories = [];
        }
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading products:', error);
        this.product_categories = [];
        this.isLoading = false;
      },
    });
  }

  // Method to search products by name
  searchProductsByName(searchTerm: string) {
    if (searchTerm.trim()) {
      this.isLoading = true;
      this.productService.searchProducts(searchTerm).subscribe({
        next: (response: any) => {
          if (Array.isArray(response)) {
            this.product_categories = response;
          } else if (response && response.products && Array.isArray(response.products)) {
            this.product_categories = response.products;
          } else if (response && response.data && Array.isArray(response.data)) {
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

    // Filter by category if selected
    if (this.selectedCategoryId) {
      products = products.filter((product) => product?.category === this.selectedCategoryId);
    }

    // Filter by search query (client-side filtering - fallback)
    if (this.searchQuery && !this.isLoading) {
      const term = this.searchQuery?.toLowerCase() || '';

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

  // Add method to handle image errors
  onImageError(event: any) {
    event.target.src = 'assets/default-product.jpg';
  }

  editProduct(product: ProductItem) {
    alert('Edit product functionality to be implemented for product: ' + product.name_product);
  }

  deleteProduct(product: ProductItem) {
    alert('Delete product functionality to be implemented for product: ' + product.name_product);
  }
}
