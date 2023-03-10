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

    addMinistry(User: User): Observable<any> {
      return this.http.post(`${this.apiUrl}​/api​/Accounts​/SigUpMinistry`, User, this.shareService.httpOptions);
    }

    addTeacher(User: User): Observable<any> {
      return this.http.post(`${this.apiUrl}​/api​/Accounts​/SigUpTeacher`, User, this.shareService.httpOptions);
    }

    addStudent(User: User): Observable<any> {
      return this.http.post(`${this.apiUrl}​/api​/Accounts​/SigUpStudent`, User, this.shareService.httpOptions);
    }
}
