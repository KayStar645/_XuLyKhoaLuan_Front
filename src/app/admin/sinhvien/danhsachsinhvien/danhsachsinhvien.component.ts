import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { shareService } from 'src/app/services/share.service';
import { sinhVienService } from 'src/app/services/sinhVien.service';

@Component({
  selector: 'app-danhsachsinhvien',
  templateUrl: './danhsachsinhvien.component.html',
  styleUrls: ['./danhsachsinhvien.component.scss'],
})
export class DanhsachsinhvienComponent implements OnInit {
  @Input() searchName = '';
  listSV: SinhVien[] = [];
  root: SinhVien[] = [];
  lineSV = new SinhVien();
  elementOld: any;

  constructor(
    private sinhVienService: sinhVienService,
    private shareService: shareService
  ) {}

  ngOnInit(): void {
    this.getAllSinhVien();
  }

  clickLine(event: any) {
    const element = event.target.parentNode;
    if (this.elementOld == element && this.lineSV.maSv != null) {
      this.elementOld.classList.remove('br-line-hover');
      this.lineSV = new SinhVien();
    } else {
      if (this.elementOld != null) {
        this.elementOld.classList.remove('br-line-hover');
      }

      element.classList.add('br-line-hover');
      this.elementOld = element;

      const mgv = element.firstElementChild.innerHTML;
      this.sinhVienService.getById(mgv).subscribe((data) => {
        this.lineSV = data;
      });
    }
  }

  getAllSinhVien() {
    this.sinhVienService.getAll().subscribe((data) => {
      this.listSV = data;
      this.root = data;
    });
  }

  getSinhVienByMaCN(maCn: string) {
    this.sinhVienService.getByMaBm(maCn).subscribe((data) => {
      this.listSV = data;
    });
  }

  sortSinhVien(sort: string) {
    if (sort == 'asc-id') {
      this.listSV.sort((a, b) => a.maSv.localeCompare(b.maSv));
    } else if (sort == 'desc-id') {
      this.listSV.sort((a, b) => b.maSv.localeCompare(a.maSv));
    } else if (sort == 'asc-name') {
      this.listSV.sort((a, b) => a.tenSv.localeCompare(b.tenSv));
    } else if (sort == 'desc-name') {
      this.listSV.sort((a, b) => b.tenSv.localeCompare(a.tenSv));
    } else if (sort == 'asc-subject') {
      this.listSV.sort((a, b) => a.maCn.localeCompare(b.maCn));
    } else if (sort == 'desc-subject') {
      this.listSV.sort((a, b) => b.maCn.localeCompare(a.maCn));
    } else {
      this.sinhVienService.getAll().subscribe((data) => {
        this.listSV = data;
      });
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.searchName) {
      this.filterItems();
    }
  }

  filterItems() {
    const searchName = this.searchName.trim().toLowerCase();
    this.listSV = this.root.filter((item) =>
      item.tenSv.toLowerCase().includes(searchName)
    );
  }

  getTenBMById(maCn: string): string {
    // Gọi service khoa chỗ này
    // Tạm thời if else
    if (maCn === 'KTPM') {
      return 'Kỹ thuật phần mềm';
    }
    if (maCn === 'MMT') {
      return 'Mạng máy tính';
    }
    if (maCn === 'HTTT') {
      return 'Hệ thống thông tin';
    }
    return 'Khoa học phân tích dữ liệu';
  }

  dateFormat(str: string): string {
    return this.shareService.dateFormat(str);
  }
}
