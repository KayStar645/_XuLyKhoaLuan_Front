import { shareService } from './share.service';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
   providedIn: 'root',
})
export class FileService {
   private apiUrl = environment.api;

   constructor(private http: HttpClient, private shareService: shareService) {}

   async uploadFile(file: File): Promise<string> {
      const formData: FormData = new FormData();

      formData.append('file', file, file.name);

      const response = await this.http
         .post<string>(`${this.apiUrl}/api/Files/upload`, formData, { responseType: 'json' })
         .toPromise();
      return response ?? '';
   }

   async downloadFile(name: string): Promise<File> {
      const response = await this.http
         .get<File>(`${this.apiUrl}/api/Files/download/${name}`, { responseType: 'json' })
         .toPromise();
      return response!;
   }
}
