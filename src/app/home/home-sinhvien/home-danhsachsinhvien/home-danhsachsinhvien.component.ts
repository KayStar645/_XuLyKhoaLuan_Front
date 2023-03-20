import { Component, ElementRef, Input, OnInit, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { ChuyenNganh } from 'src/app/models/ChuyenNganh.model';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { shareService } from 'src/app/services/share.service';
import { sinhVienService } from 'src/app/services/sinhVien.service';
import { getParentElement } from 'src/assets/utils';

@Component({
  selector: 'app-home-danhsachsinhvien',
  templateUrl: './home-danhsachsinhvien.component.html',
})
export class HomeDanhsachsinhvienComponent implements OnInit {
  @Input() searchName = '';
  @Input() isSelectedSV = false;
  @Output() returnIsSelectedSV = new EventEmitter<boolean>();
  root: SinhVien[] = [];
  sinhVien = new SinhVien();

  listSV: SinhVien[] = [];
  listCN: ChuyenNganh[] = [];
  selectedSV: string[] = [];
  lineSV = new SinhVien();
  elementOld: any;

  constructor(
    private sinhVienService: sinhVienService,
    private elementRef: ElementRef,
    private chuyenNganhService: chuyenNganhService,
    private shareService: shareService,
  ) {}

  async ngOnInit() {
    this.getAllSinhVien();
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
  }

  async getSinhVienByMaCN(maCn: string) {
    this.listSV = await this.sinhVienService.getByMaCn(maCn);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.searchName) {
      this.filterItems();
    }
  }

  filterItems() {
    const searchName = this.searchName.trim().toLowerCase();
    this.listSV = this.root.filter((item) => {
        item.tenSv.toLowerCase().includes(searchName)
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

  dateFormat(str: string) {
    return this.shareService.dateFormat(str);
  }
}

