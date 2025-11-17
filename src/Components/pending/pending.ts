import { Component, OnInit } from '@angular/core';
import { OrderService } from '../Services/order';
import { DecimalPipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-pending',
  imports: [NgFor, DecimalPipe],
  templateUrl: './pending.html',
})
export class Pending implements OnInit {
  orders: any[] = [];

  constructor(private orderService: OrderService) {}

  ngOnInit() {
    this.loadPending();
  }

  loadPending() {
    this.orderService.getAllOrders().subscribe({
      next: (data) => (this.orders = data),
      error: (err) => console.error(err),
    });
  }

  getTotalQty(products: any[]) {
    return products.reduce((sum, p) => sum + p.qty, 0);
  }

  getTotalPrice(products: any[]) {
    return products.reduce((sum, p) => sum + p.amount, 0).toFixed(2);
  }

  confirm(id: string) {
    this.orderService.confirmOrder(id).subscribe(() => this.loadPending());
  }

  cancel(id: string) {
    this.orderService.cancelOrder(id).subscribe(() => this.loadPending());
  }
  remove(id: string) {
    const order = this.orders.find((o) => o._id === id);

    if (order.status !== 'cancelled') {
      return alert('❌ You can only remove cancelled orders.');
    }

    if (confirm('Are you sure you want to remove this order?')) {
      this.orderService.deleteOrder(id).subscribe(() => this.loadPending());
    }
  }
}
