import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule, FormGroup } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthApiService } from '../Services/ath';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, RouterLink],
  templateUrl: './register.html',
})
export class Register {
  registerForm!: FormGroup;
  imagePreview: string | null = null;

  constructor(private fb: FormBuilder, private api: AuthApiService, private router: Router) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      phone: ['', Validators.required],
      profile_img: [null], // ✅ image field
    });
  }

  // ✅ IMAGE SELECT + PREVIEW
  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || !input.files[0]) return;

    const file = input.files[0];
    this.registerForm.patchValue({ profile_img: file });
    this.registerForm.get('profile_img')?.updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  // ✅ SUBMIT FORM (FormData)
  submit() {
    if (this.registerForm.invalid) return;

    const formData = new FormData();

    Object.entries(this.registerForm.value).forEach(([key, value]) => {
      if (value === null || value === undefined) return;

      // ✅ If file
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        // ✅ Convert everything else to string
        formData.append(key, String(value));
      }
    });

    this.api.registerAdmin(formData).subscribe({
      next: () => {
        alert('Admin registered successfully');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        alert(err.error?.message || 'Register failed');
      },
    });
  }
}
