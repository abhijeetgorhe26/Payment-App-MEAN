import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  apiUrl = 'http://localhost:3000/auth';

  email: string = '';
  password: string = '';
  error: string = ''

  count: number = 0;

  loginData = {
    email: '',
    password: ''
  };

  constructor(private http: HttpClient, private router: Router) { }

  login() {

    this.loginData.email = this.email;
    this.loginData.password = this.password;

    if (this.loginData.email === '' || this.loginData.password === '') {
      this.error = 'Invalid email or password'
      return;
    }

    this.http.post(`${this.apiUrl}/login`, this.loginData).subscribe({

      next: (res: any) => {
        console.log('Login success', res.token);
        localStorage.setItem('token', res.token)
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.log(this.count++);
        console.error('Login failed', err);
        this.error = err.error.message;
      }
    });
  }
}