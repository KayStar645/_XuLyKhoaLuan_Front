import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { User } from 'src/app/models/User.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private loggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  private apiUrl = environment.api;

  constructor(private http: HttpClient, private router: Router) {}

  // Chạy được
  // add(giaoVu: GiaoVu): Observable<GiaoVu> {
  //   return this.http.post<GiaoVu>(`${this.apiUrl}/api/Giaovus`, giaoVu);
  // }

  public logIn(user: User, role: string) {
    var login;
    if(role == 'Admin') {
      login = this.http.post<any>(`${this.apiUrl}/api/Accounts/SigInMinistry`, user);
    }
    else if(role == 'Teacher') {
      login = this.http.post<any>(`${this.apiUrl}/api/Accounts/SigInTeacher`, user);
    } else {
      login = this.http.post<any>(`${this.apiUrl}/api/Accounts/SigInStudent`, user);
    }
    
    login.subscribe(
      (response: any) => {
        if (response.token) {
          // Lưu trữ token trong local storage
          localStorage.setItem('token', response.token);
          console.log(response.token);
        } else {
          console.log('Đăng nhập thất bại');
        }
      },
      (error) => {
        console.log(error.token);
        console.log('Đăng nhập thất bại');
      }
    );

    //return this.http.post<any>(this.apiUrl, user);

    // return this.http.post<any>(this.apiUrl, user).subscribe(data => {
    //   localStorage.setItem('token', data);
    // });
  }

  public logOut() {
    localStorage.removeItem('token');

    this.loggedIn.next(false);
    this.router.navigate(['/login']);
  }

  public isLoggedIn(): Observable<boolean> {
    //this.loggedIn.asObservable();

    const token = localStorage.getItem('token');
    return token ? new BehaviorSubject<boolean>(true) : new BehaviorSubject<boolean>(false);
  }

  // isLoggedIn(): boolean {
  //   return localStorage.getItem('token') !== null;
  // }
}
