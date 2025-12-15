import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService, UserItem } from '../Services/userservice';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, NgIf, FormsModule],
  templateUrl: './user.html',
  styleUrls: ['./user.css'],
})
export class User implements OnInit {
  users: UserItem[] = [];
  editPopup = false;

  // ✅ Editing model
  editUserData: Partial<UserItem> = {};

  constructor(private userService: UserService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAllUsers().subscribe({
      next: (data) => (this.users = data),
      error: (err) => console.error('❌ Failed to fetch users:', err),
    });
  }

  // ✅ OPEN POPUP WITH DATA
  editUser(user: UserItem) {
    this.editUserData = {
      ...user,
      date: user.date ? new Date(user.date).toLocaleDateString() : '',
    };

    this.editPopup = true;
  }

  // ✅ CLOSE POPUP
  closeEdit() {
    this.editPopup = false;
    this.editUserData = {};
  }

  // ✅ UPDATE USER (NO PASSWORD)
  updateUser() {
    if (!this.editUserData._id) return;

    const payload = {
      name_user: this.editUserData.name_user,
      email: this.editUserData.email,
      phone_number: this.editUserData.phone_number,
      address: this.editUserData.address,
      profile_img: this.editUserData.profile_img,
    };

    this.userService.updateUser(this.editUserData._id, payload).subscribe({
      next: () => {
        alert('✅ User updated successfully');
        this.loadUsers();
        this.closeEdit();
      },
      error: (err) => console.error('❌ Update failed:', err),
    });
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
