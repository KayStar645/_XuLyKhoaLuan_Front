import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { environment } from 'src/environments/environment';
import { User } from '../models/User.model';
import { shareService } from './share.service';

@Injectable({
  providedIn: 'root',
})
export class userService {
    private apiUrl = environment.api;
    //private BaoCaos!: BehaviorSubject<BaoCao>;

    constructor(private http: HttpClient, private router: Router,
      private shareService: shareService) {}

    addMinistry(user: User): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Accounts/SigUpMinistry`, user, this.shareService.httpOptions);
    }

    addTeacher(user: User): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Accounts/SigUpTeacher`, user, this.shareService.httpOptions);
    }

    addStudent(user: User): Observable<any> {
      return this.http.post(`${this.apiUrl}/api/Accounts/SigUpStudent`, user, this.shareService.httpOptions);
    }

    delete(id: string) {
      return this.http.delete(`${this.apiUrl}/api/Accounts/${id}`, this.shareService.httpOptions);
    }
}
