import { Component, OnInit } from '@angular/core';
import { ProductService } from '../Services/product-service';
import { CategoryService } from '../Services/cetecory';
import { NgFor, NgIf } from '@angular/common';

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
  selector: 'app-product',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './product.html',
  styleUrls: ['./product.css'],
})
export class Product implements OnInit {
  product_categories: ProductItem[] = [];
  categories: CategoryItem[] = [];
  selectedCategoryId: string = '';
  isLoading: boolean = false;
  listcetecory: any[] = [];

  constructor(private productService: ProductService, private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadProducts();
    this.GetAllCategories();
  }

  GetAllCategories() {
    this.categoryService.getAllCategories().subscribe((data: any) => {
      this.listcetecory = data.categories;
      console.log('Category Data:', this.listcetecory);
    });
  }

  loadCategories() {
    this.categoryService.getAllCategories().subscribe({
      next: (response: any) => {
        console.log('Categories Response:', response);

        if (Array.isArray(response)) {
          this.categories = response;
        } else if (response && response.categories && Array.isArray(response.categories)) {
          this.categories = response.categories;
        } else if (response && response.data && Array.isArray(response.data)) {
          this.categories = response.data;
        } else {
          this.categories = [];
        }
      },
      error: (error: any) => {
        console.error('Error fetching categories:', error);
        this.categories = [];
      },
    });
  }

  loadProducts() {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (response: any) => {
        console.log('Products Response:', response);

        let allProducts: ProductItem[] = [];
        if (Array.isArray(response)) {
          allProducts = response;
        } else if (response && response.products && Array.isArray(response.products)) {
          allProducts = response.products;
        } else if (response && response.data && Array.isArray(response.data)) {
          allProducts = response.data;
        }

        this.product_categories = allProducts;
        this.isLoading = false;
      },
      error: (error: any) => {
        console.error('Error fetching products:', error);
        this.product_categories = [];
        this.isLoading = false;
      },
    });
  }

  loadProductsByCategory(categoryId: string) {
    if (categoryId) {
      this.isLoading = true;

      // Instead of calling getCategoryById, we'll filter the products we already have
      this.productService.getAllProducts().subscribe({
        next: (response: any) => {
          let allProducts: ProductItem[] = [];
          if (Array.isArray(response)) {
            allProducts = response;
          } else if (response && response.products && Array.isArray(response.products)) {
            allProducts = response.products;
          } else if (response && response.data && Array.isArray(response.data)) {
            allProducts = response.data;
          }

          // Filter products by the selected category ID
          this.product_categories = allProducts.filter(
            (product) => product.category === categoryId
          );
          this.isLoading = false;
        },
        error: (error: any) => {
          console.error('Error fetching products:', error);
          this.product_categories = [];
          this.isLoading = false;
        },
      });
    } else {
      this.loadProducts(); // Load all products if no category selected
    }
  }

  onCategoryChange(event: any) {
    this.selectedCategoryId = event.target.value;
    this.loadProductsByCategory(this.selectedCategoryId);
  }

  // Method to handle image errors
  onImageError(event: any) {
    event.target.src = 'assets/default-product.jpg';
  }

  // Method for template
  getSelectedCategoryName(): string {
    if (this.selectedCategoryId) {
      const category = this.categories.find((c) => c._id === this.selectedCategoryId);
      return category ? category.name_category : 'Products';
    }
    return 'All Products';
  }

  editProduct(product: ProductItem) {
    alert('Edit product functionality to be implemented for product: ' + product.name_product);
  }

  deleteProduct(product: ProductItem) {
    alert('Delete product functionality to be implemented for product: ' + product.name_product);
  }

  editCategory(category: CategoryItem) {
    alert('Edit category functionality to be implemented for category: ' + category.name_category);
  }

  removeCategory(category: CategoryItem) {
    alert(
      'Remove category functionality to be implemented for category: ' + category.name_category
    );
  }
}
