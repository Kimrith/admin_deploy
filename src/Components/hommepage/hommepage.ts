import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { UserService } from '../Services/userservice';
import { ProductService } from '../Services/product-service';
import { CategoryService } from '../Services/cetecory';
declare const Chart: any;

@Component({
  selector: 'app-home',
  template: `
    <div class="min-h-screen bg-gray-50 p-4 sm:p-6">
      <!-- Title -->
      <h2 class="text-2xl font-bold text-gray-800 text-center mb-6">📊 Admin Dashboard</h2>

      <!-- Summary Cards -->
      <div class="flex justify-center w-full mb-8">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full max-w-5xl px-2">
          <div
            class="bg-white rounded-xl shadow-sm p-5 text-center hover:shadow-md transition-shadow"
          >
            <h3 class="text-gray-600 font-medium mb-1">Total Users</h3>
            <p class="text-3xl font-bold text-blue-600">{{ totalUsers }}</p>
          </div>
          <div
            class="bg-white rounded-xl shadow-sm p-5 text-center hover:shadow-md transition-shadow"
          >
            <h3 class="text-gray-600 font-medium mb-1">Total Categories</h3>
            <p class="text-3xl font-bold text-orange-500">{{ totalCategories }}</p>
          </div>
          <div
            class="bg-white rounded-xl shadow-sm p-5 text-center hover:shadow-md transition-shadow"
          >
            <h3 class="text-gray-600 font-medium mb-1">Total Products</h3>
            <p class="text-3xl font-bold text-emerald-500">{{ totalProducts }}</p>
          </div>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div class="bg-white rounded-xl shadow-sm p-4 h-80 flex flex-col">
          <canvas #userChartCanvas class="flex-1 w-full"></canvas>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-4 h-80 flex flex-col">
          <canvas #categoryChartCanvas class="flex-1 w-full"></canvas>
        </div>
        <div class="bg-white rounded-xl shadow-sm p-4 h-80 flex flex-col">
          <canvas #productChartCanvas class="flex-1 w-full"></canvas>
        </div>
      </div>
    </div>
  `,
})
export class Hommepage implements AfterViewInit {
  @ViewChild('userChartCanvas', { static: false }) userChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('categoryChartCanvas', { static: false })
  categoryChartCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('productChartCanvas', { static: false })
  productChartCanvas!: ElementRef<HTMLCanvasElement>;

  totalUsers = 0;
  totalCategories = 0;
  totalProducts = 0;

  constructor(
    private userService: UserService,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

  ngAfterViewInit(): void {
    this.loadUserChart();
    this.loadCategoryChart();
    this.loadProductChart();
  }

  // Users Chart
  loadUserChart(): void {
    this.userService.getAllUsers().subscribe((users) => {
      this.totalUsers = users.length;

      const monthCounts: Record<string, number> = {};
      const monthOrder = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];

      users.forEach((user) => {
        const month = new Date(user.date).toLocaleString('default', { month: 'short' });
        monthCounts[month] = (monthCounts[month] || 0) + 1;
      });

      const labels = monthOrder;
      const values = monthOrder.map((m) => monthCounts[m] || 0);

      const ctx = this.userChartCanvas.nativeElement.getContext('2d');
      if (!ctx) return;

      new Chart(ctx, {
        type: 'line',
        data: {
          labels,
          datasets: [
            {
              label: 'Users per Month',
              data: values,
              borderColor: '#2563eb',
              backgroundColor: 'rgba(37, 99, 235, 0.2)',
              borderWidth: 2,
              tension: 0.3,
              fill: true,
            },
          ],
        },
        options: {
          plugins: {
            title: { display: true, text: 'User Registrations by Month', font: { size: 18 } },
            legend: { display: true },
          },
          scales: { y: { beginAtZero: true } },
        },
      });
    });
  }

  // Categories Chart
  loadCategoryChart(): void {
    this.categoryService.getAllCategories().subscribe((response: any) => {
      const count = response.categories.length;
      this.totalCategories = count;

      const ctx = this.categoryChartCanvas.nativeElement.getContext('2d');
      if (!ctx) return;

      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Categories'],
          datasets: [
            {
              data: [count],
              backgroundColor: ['#f97316'],
              borderWidth: 0,
            },
          ],
        },
        options: {
          plugins: {
            title: { display: true, text: 'Categories Count', font: { size: 16 } },
            legend: { display: false },
          },
        },
      });
    });
  }

  // Products Chart
  loadProductChart(): void {
    this.productService.getAllProducts().subscribe((response: any) => {
      const count = response.products.length;
      this.totalProducts = count;

      const ctx = this.productChartCanvas.nativeElement.getContext('2d');
      if (!ctx) return;

      new Chart(ctx, {
        type: 'polarArea',
        data: {
          labels: ['Products'],
          datasets: [
            {
              data: [count],
              backgroundColor: ['#10b981'],
              borderWidth: 0,
            },
          ],
        },
        options: {
          plugins: {
            title: { display: true, text: 'Products Count', font: { size: 16 } },
            legend: { display: false },
          },
        },
      });
    });
  }
}
