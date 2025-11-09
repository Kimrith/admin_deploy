import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { UserService } from '../Services/userservice';
import { ProductService } from '../Services/product-service';
import { CategoryService } from '../Services/cetecory';
declare const Chart: any;

@Component({
  selector: 'app-home',
  template: `
    <div class="dashboard-container">
      <h2 class="dashboard-title">📊 Admin Dashboard</h2>

      <div class="summary-cards">
        <div class="card">
          <h3>Total Users</h3>
          <p>{{ totalUsers }}</p>
        </div>
        <div class="card">
          <h3>Total Categories</h3>
          <p>{{ totalCategories }}</p>
        </div>
        <div class="card">
          <h3>Total Products</h3>
          <p>{{ totalProducts }}</p>
        </div>
      </div>

      <div class="charts-grid">
        <div class="chart-card">
          <canvas #userChartCanvas></canvas>
        </div>
        <div class="chart-card">
          <canvas #categoryChartCanvas></canvas>
        </div>
        <div class="chart-card">
          <canvas #productChartCanvas></canvas>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .dashboard-container {
        padding: 30px;
        background-color: #f9fafb;
        min-height: 100vh;
        font-family: 'Inter', sans-serif;
      }

      .dashboard-title {
        text-align: center;
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 30px;
        color: #1e293b;
      }

      .summary-cards {
        display: flex;
        justify-content: center;
        gap: 30px;
        flex-wrap: wrap;
        margin-bottom: 40px;
      }

      .card {
        background: white;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
        width: 200px;
        padding: 20px;
        text-align: center;
        transition: transform 0.2s ease, box-shadow 0.2s ease;
      }

      .card:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 18px rgba(0, 0, 0, 0.12);
      }

      .card h3 {
        font-size: 16px;
        color: #64748b;
        margin-bottom: 10px;
      }

      .card p {
        font-size: 28px;
        font-weight: bold;
        color: #2563eb;
        margin: 0;
      }

      .charts-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
        gap: 30px;
      }

      .chart-card {
        background: white;
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        height: 400px;
      }
    `,
  ],
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
