import { shareService } from './../../../services/share.service';
import { giangVienService } from './../../../services/giangVien.service';
import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { GiangVien } from 'src/app/models/GiangVien.model';

@Component({
  selector: 'app-danhsachgiangvien',
  templateUrl: './danhsachgiangvien.component.html',
  styleUrls: ['./danhsachgiangvien.component.scss'],
})
export class DanhsachgiangvienComponent implements OnInit {
  @Input() searchName = '';
  listGV: GiangVien[] = [];
  root: GiangVien[] = [];
  lineGV = new GiangVien();
  elementOld: any;

  constructor(
    private giangVienService: giangVienService,
    private shareService: shareService
  ) {}

  ngOnInit(): void {
    this.getAllGiangVien();
  }

  clickLine(event: any) {
    const element = event.target.parentNode;
    if (this.elementOld == element && this.lineGV.maGv != null) {
      this.elementOld.classList.remove('br-line-hover');
      this.lineGV = new GiangVien();
    } else {
      if (this.elementOld != null) {
        this.elementOld.classList.remove('br-line-hover');
      }

      element.classList.add('br-line-hover');
      this.elementOld = element;

      const mgv = element.firstElementChild.innerHTML;
      this.giangVienService.getById(mgv).subscribe((data) => {
        this.lineGV = data;
      });
    }
  }

  getAllGiangVien() {
    this.giangVienService.getAll().subscribe((data) => {
      this.listGV = data;
      this.root = data;
    });
  }

  getGiangVienByMaBM(maBM: string) {
    this.giangVienService.getByBoMon(maBM).subscribe((data) => {
      this.listGV = data;
    });
  }

  sortGiangVien(sort: string) {
    if (sort == 'asc-id') {
      this.listGV.sort((a, b) => a.maGv.localeCompare(b.maGv));
    } else if (sort == 'desc-id') {
      this.listGV.sort((a, b) => b.maGv.localeCompare(a.maGv));
    } else if (sort == 'asc-name') {
      this.listGV.sort((a, b) => a.tenGv.localeCompare(b.tenGv));
    } else if (sort == 'desc-name') {
      this.listGV.sort((a, b) => b.tenGv.localeCompare(a.tenGv));
    } else if (sort == 'asc-subject') {
      this.listGV.sort((a, b) => a.maBm.localeCompare(b.maBm));
    } else if (sort == 'desc-subject') {
      this.listGV.sort((a, b) => b.maBm.localeCompare(a.maBm));
    } else {
      this.giangVienService.getAll().subscribe((data) => {
        this.listGV = data;
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
    this.listGV = this.root.filter((item) =>
      item.tenGv.toLowerCase().includes(searchName)
    );
  }

  getTenBMById(maBM: string): string {
    // Gọi service khoa chỗ này
    // Tạm thời if else
    if (maBM === 'KTPM') {
      return 'Kỹ thuật phần mềm';
    }
    if (maBM === 'MMT') {
      return 'Mạng máy tính';
    }
    if (maBM === 'HTTT') {
      return 'Hệ thống thông tin';
    }
    return 'Khoa học phân tích dữ liệu';
  }

  dateFormat(str: string): string {
    return this.shareService.dateFormat(str);
  }
}
