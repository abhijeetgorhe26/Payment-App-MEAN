import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit {

  apiUrl = 'http://localhost:3000/api/v1';

  userEmail: string = '';
  balance: number = 0;
  users: any[] = [];
  search: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUserFromToken();
    this.getBalance();
    this.getUsers();
  }

  // ✅ Extract email from JWT
  loadUserFromToken() {
    const token = localStorage.getItem('token');

    if (!token) return;

    const payload = JSON.parse(atob(token.split('.')[1]));
    this.userEmail = payload.email;
  }

  // ✅ Auth headers
  getHeaders() {
    const token = localStorage.getItem('token');

    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  // ✅ Get Balance
  getBalance() {
    this.http.get(`${this.apiUrl}/balance`, this.getHeaders())
      .subscribe({
        next: (res: any) => {
          this.balance = res.balance;
        },
        error: (err) => {
          console.error('Balance error', err);
        }
      });
  }

  // ✅ Get Users
  getUsers() {
    this.http.get(`${this.apiUrl}/bulk?filter=${this.search}`, this.getHeaders())
      .subscribe({
        next: (res: any) => {
          this.users = res.users || [];
        },
        error: (err) => {
          console.error('Users error', err);
        }
      });
  }

  // ✅ Search Users (auto trigger)
  onSearchChange() {
    this.getUsers();
  }

  // ✅ Send Money
  sendMoney(userId: number) {
    const amount = prompt("Enter amount");

    if (!amount || isNaN(Number(amount))) {
      alert("Invalid amount");
      return;
    }

    this.http.post(`${this.apiUrl}/transfer`, {
      to: userId,
      amount: Number(amount)
    }, this.getHeaders())
    .subscribe({
      next: () => {
        alert("Transfer successful 💸");
        this.getBalance(); // refresh balance
      },
      error: (err) => {
        alert(err.error?.message || "Transfer failed");
      }
    });
  }
}