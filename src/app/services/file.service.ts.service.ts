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

   async uploadFile(file: File): Promise<any> {
      const formData: FormData = new FormData();

      formData.append('file', file, file.name);

      const response = await this.http
         .post<any>(`${this.apiUrl}/api/Files/upload`, formData, { responseType: 'json' })
         .toPromise();
      return response ?? '';
   }

   async downloadFile(name: string): Promise<void> {
      const response = await this.http
         .get(`${this.apiUrl}/api/Files/download/${name}`, { responseType: 'blob' })
         .toPromise();

      const blob = new Blob([response!], { type: 'application/octet-stream' });

      // Tạo một đường dẫn URL tạm thời cho blob
      const url = window.URL.createObjectURL(blob);

      // Tạo một thẻ a ẩn và thiết lập thuộc tính href thành URL tạm thời
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = name.substring(name.lastIndexOf('__') + 2);

      // Thêm thẻ a vào DOM và bắt đầu tải xuống tệp
      document.body.appendChild(a);
      a.click();

      // Xóa thẻ a và giải phóng URL tạm thời sau khi tải xuống hoàn tất
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
   }
}
