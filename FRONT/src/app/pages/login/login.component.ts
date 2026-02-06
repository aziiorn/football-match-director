import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';

  constructor(private auth: AuthService, private router: Router) { }

  onSubmit() {
    this.auth.login({ username: this.username, password: this.password })
      .subscribe({
        next: res => {
          this.auth.saveToken(res.token);
          this.router.navigate(['/home']);
        },
        error: err => {
          this.error = 'Identifiants invalides';
        }
      });
  }
}