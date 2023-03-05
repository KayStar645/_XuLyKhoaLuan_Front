
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class shareService {
    public httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };

    constructor(private http: HttpClient, private router: Router) {}

    public dateFormat(date: string) {
        if(date != null) {
            return date.substring(8, 10) + "/" +
                           date.substring(5, 7) + "/" +
                           date.substring(0, 4);
        }
        return date;
    }
    
    
    
}
