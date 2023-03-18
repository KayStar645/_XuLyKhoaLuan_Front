import { thamGiaService } from './../../../services/thamGia.service';
import { thamGiaHdService } from './../../../services/thamGiaHD.service';
import { ThamGia } from './../../../models/ThamGia.model';
import { dotDkService } from './../../../services/dotDk.service';
import {
  Component,
  ElementRef,
  Input,
  OnInit,
  SimpleChanges,
  EventEmitter,
  Output,
} from '@angular/core';
import { ChuyenNganh } from 'src/app/models/ChuyenNganh.model';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { shareService } from 'src/app/services/share.service';
import { sinhVienService } from 'src/app/services/sinhVien.service';
import { getParentElement } from 'src/assets/utils';

@Component({
  selector: 'app-ministry-danhsachthamgia',
  templateUrl: './ministry-danhsachthamgia.component.html',
  // styleUrls: ['./ministry-danhsachthamgia.component.scss']
})
export class MinistryDanhsachthamgiaComponent implements OnInit {
  @Input() searchName = '';
  @Input() isSelectedSV = false;
  @Output() returnIsSelectedSV = new EventEmitter<boolean>();
  listTg: ThamGia[] = [];
  root: ThamGia[] = [];
  sinhVien = new SinhVien();

  listSV: SinhVien[] = [];
  listCN: ChuyenNganh[] = [];
  selectedSV: string[] = [];
  //root: SinhVien[] = [];
  lineSV = new SinhVien();
  elementOld: any;

  constructor(
    private sinhVienService: sinhVienService,
    private elementRef: ElementRef,
    private chuyenNganhService: chuyenNganhService,
    private shareService: shareService,
    private dotDkService: dotDkService,
    private thamGiaService: thamGiaService,
  ) {}

  async ngOnInit() {
    this.getAllSinhVien();
    this.getAllSinhVienByDotdk();
    this.listCN = await this.chuyenNganhService.getAll();

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.selectedSV = [];
        this.returnIsSelectedSV.emit(false);
        let activeLine = this.elementRef.nativeElement.querySelectorAll(
          '.br-line.br-line-click'
        );

        if (activeLine) {
          activeLine.forEach((line: any) => {
            line.classList.remove('br-line-click');
          });
        }
      }
    });
  }

  async clickLine(event: any) {
    const parent = getParentElement(event.target, '.br-line');
    const firstChild = parent.firstChild;
    const activeLine = this.elementRef.nativeElement.querySelector(
      '.br-line.br-line-dblclick'
    );

    if(!parent.classList.contains('br-line-dblclick')) {
      this.lineSV = await this.sinhVienService.getById(firstChild.innerText);
    }

    activeLine && activeLine.classList.remove('br-line-dblclick');
    parent.classList.add('br-line-dblclick');
  }

  async getAllSinhVien() {
    this.listSV = await this.sinhVienService.getAll();
    console.log(this.listSV);
  }

  async getAllSinhVienByDotdk() {
    this.listTg = await this.thamGiaService.getAll();
    this.root = this.listTg;
  }

  async getSinhVienByMaCN(maCn: string) {
    this.listTg = await this.thamGiaService.getByCn(maCn);
  }

  getSinhVienByDotDk(namHoc: string, dot:  number) {
    this.listTg = this.root.filter((t) => t.namHoc == namHoc && t.dot == dot) || [];
  }

  getSelectedLine(e: any) {
    if (e.ctrlKey) {
      this.returnIsSelectedSV.emit(true);
      const activeDblClick = this.elementRef.nativeElement.querySelector(
        '.br-line.br-line-dblclick'
      );
      const parent = getParentElement(e.target, '.br-line');
      const firstChild = parent.firstChild;

      if (activeDblClick) {
        activeDblClick.classList.remove('.br-line-dblclick');
        this.lineSV = new SinhVien();
      }

      if (parent.classList.contains('br-line-click')) {
        let childIndex = this.selectedSV.findIndex(
          (t) => t === firstChild.innerText
        );

        parent.classList.remove('br-line-click');
        this.selectedSV.splice(childIndex, 1);
      } else {
        parent.classList.add('br-line-click');
        this.selectedSV.push(firstChild.innerText);
      }

      if (this.selectedSV.length === 0) {
        this.returnIsSelectedSV.emit(false);
      }
    }
  }

  async sortSinhVien(sort: string) {
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
      this.listSV = await this.sinhVienService.getAll();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.searchName) {
      this.filterItems();
    }
  }

  filterItems() {
    const searchName = this.searchName.trim().toLowerCase();
    this.listTg = this.root.filter((item) => {
      console.log("117 - danh sách sinh viên");
        // item.tenSv.toLowerCase().includes(searchName)
    }
    );
  }

  getTenCNById(maCn: string): string {
    let tencn: any = '';

    if (this.listCN) {
      tencn = this.listCN.find((t) => t.maCn === maCn)?.tenCn;
    }
    return tencn;
  }

  getSinhVienById(maSV: string) {
    this.sinhVien = this.listSV.find((t) => t.maSv === maSV) ?? this.sinhVien;
  }

  dateFormat(str: string) {
    return this.shareService.dateFormat(str);
  }
}
