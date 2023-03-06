import { shareService } from './../../../services/share.service';
import { giangVienService } from './../../../services/giangVien.service';
import { Component, ElementRef, OnInit } from '@angular/core';
import { GiangVien } from 'src/app/models/GiangVien.model';

@Component({
  selector: 'app-danhsachgiangvien',
  templateUrl: './danhsachgiangvien.component.html',
  styleUrls: ['./danhsachgiangvien.component.scss']
})
export class DanhsachgiangvienComponent implements OnInit {
  listGV: GiangVien[] = [];
  lineGV!: GiangVien;
  elementOld: any;

  constructor(private elementRef: ElementRef, private giangVienService: giangVienService,
    private shareService: shareService) { }

  ngOnInit(): void {
    this.giangVienService.getAll().subscribe( data => {
      this.listGV = data;
    })
  }

  clickLine(event: any) {
    const element = event.target.parentNode;
    if(this.elementOld == element && this.lineGV.maGv != null) {
      this.elementOld.classList.remove('br-line-hover');
      this.lineGV = new GiangVien();
    }
    else {
      if(this.elementOld != null) {
        this.elementOld.classList.remove('br-line-hover');
      }

      element.classList.add('br-line-hover');
      this.elementOld = element;

      const mgv = element.firstElementChild.innerHTML;
      this.giangVienService.getById(mgv).subscribe(data => {
        this.lineGV = data;
      });
    }
  }

  getTenKhoaById(maKhoa: string): string {
    // Gọi service khoa chỗ này
    // Tạm thời if else
    if(maKhoa === 'KTPM') {
      return "Kỹ thuật phần mềm";
    }
    if(maKhoa === 'MMT') {
      return "Mạng máy tính";
    }
    if(maKhoa === 'HTTT') {
      return "Hệ thống thông tin";
    }
    return "Khoa học phân tích dữ liệu";
  }

  dateFormat(str: string): string {
    return this.shareService.dateFormat(str);
  }

}
