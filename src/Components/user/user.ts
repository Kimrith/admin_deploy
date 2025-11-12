import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService, UserItem } from '../Services/userservice';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user.html',
  styleUrls: ['./user.css'],
})
export class User implements OnInit {
  users: UserItem[] = [];

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        this.users = data;
      },
      error: (err) => console.error('❌ Failed to fetch users:', err),
    });
  }

  editUser(id: string) {
    // Implement user edit functionality here
    alert(`Edit user with ID: ${id}`);
  }

  removeUser(id: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(id).subscribe({
        next: () => {
          this.users = this.users.filter((u) => u._id !== id);
          alert('✅ User deleted successfully!');
        },
        error: (err) => console.error('❌ Failed to delete user:', err),
      });
    }
  }

  trackByFn(index: number, item: UserItem) {
    return item._id || index;
  }
}
