import { DuyetDt } from '../../../models/DuyetDt.model';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { ChuyenNganh } from '../../../models/ChuyenNganh.model';
import { DeTai_ChuyenNganh } from '../../../models/DeTai_ChuyenNganh.model';
import { deTai_chuyenNganhService } from '../../../services/deTai_chuyenNganh.service';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { giangVienService } from '../../../services/giangVien.service';
import { RaDe } from '../../../models/RaDe.model';
import { duyetDtService } from '../../../services/duyetDt.service';
import { raDeService } from '../../../services/raDe.service';
import { Component, ElementRef, Input, SimpleChanges } from '@angular/core';
import { DeTai } from 'src/app/models/DeTai.model';
import { deTaiService } from 'src/app/services/deTai.service';
import { shareService } from 'src/app/services/share.service';
import { forkJoin, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { getParentElement } from 'src/assets/utils';

@Component({
  selector: 'app-danhsachdetai',
  templateUrl: './ministry-danhsachdetai.component.html',
  styleUrls: ['./ministry-danhsachdetai.component.scss'],
})
export class MinistryDanhsachdetaiComponent {
  @Input() searchName = '';
  listDT: DeTai[] = [];
  root: DeTai[] = [];
  lineDT = new DeTai();
  elementOld: any;

  listRade: RaDe[] = [];
  listDuyetDt: DuyetDt[] = [];
  listGiangvien: GiangVien[] = [];
  listDeta_Chuyennganh: DeTai_ChuyenNganh[] = [];
  listChuyennganh: ChuyenNganh[] = [];

  constructor(
    private deTaiService: deTaiService,
    private elementRef: ElementRef,
    private shareService: shareService,
    private raDeService: raDeService,
    private duyetDtService: duyetDtService,
    private giangVienService: giangVienService,
    private chuyenNganhService: chuyenNganhService,
    private deTai_chuyenNganhService: deTai_chuyenNganhService
  ) {}

  ngOnInit(): void {
    this.getAllDeTai();

    this.raDeService.getAll().subscribe((data) => (this.listRade = data));
    this.duyetDtService.getAll().subscribe((data) => (this.listDuyetDt = data));
    this.giangVienService
      .getAll()
      .subscribe((data) => (this.listGiangvien = data));
    this.deTai_chuyenNganhService
      .getAll()
      .subscribe((data) => (this.listDeta_Chuyennganh = data));
    this.chuyenNganhService
      .getAll()
      .subscribe((data) => (this.listChuyennganh = data));
  }

  clickLine(event: any) {
    const parent = getParentElement(event.target, '.br-line');
    const firstChild = parent.firstChild;
    const activeLine = this.elementRef.nativeElement.querySelector(
      '.br-line.br-line-hover'
    );

    !parent.classList.contains('br-line-hover') &&
      this.deTaiService.getById(firstChild.innerText).subscribe((data) => {
        this.lineDT = data;
      });

    activeLine && activeLine.classList.remove('br-line-hover');
    parent.classList.add('br-line-hover');
  }

  onShowDetail(event: MouseEvent) {
    const parent = getParentElement(event.target, '.br-line');
    const firstChild = parent.firstChild;
    const activeLine = this.elementRef.nativeElement.querySelector(
      '.br-line.br-line-hover'
    );

    this.deTaiService.getById(firstChild.innerText).subscribe((data) => {
      this.lineDT = data;
      document.querySelector('.update-btn')?.dispatchEvent(new Event('click'));
    });

    activeLine && activeLine.classList.remove('br-line-hover');
    parent.classList.add('br-line-hover');
  }

  getAllDeTai() {
    this.deTaiService.getAll().subscribe((data) => {
      this.listDT = data;
      this.root = data;

      this.listDT.forEach((info) => {
        let topicSummary = document.createElement('div');
        let topicName = document.createElement('div');

        topicSummary.innerHTML = info.tomTat;
        topicName.innerHTML = info.tenDT;

        let firstSummary: any = topicSummary.firstChild?.textContent;
        let firstName: any = topicName.firstChild?.textContent;

        info.tomTat = firstSummary;
        info.tenDT = firstName;
      });
    });
  }

  getGiangVienByMaCn(maCn: string) {
    for (let item of this.listDT) {
      if (this.deTai_chuyenNganhService.getByMaDtMaCn(item.maDT, maCn)) {
      }
    }
    this.deTaiService.getByChuyenNganh(maCn).subscribe((data) => {
      this.listDT = data;
    });
  }

  getTenChuyennganhByMaDT(maDT: string) {
    let result = [];
    let dtcns = this.listDeta_Chuyennganh.filter((item) => item.maDt == maDT);

    for (let item of dtcns) {
      result.push(this.listChuyennganh.find((c) => c.maCn == item.maCn)?.tenCn);
    }
    return result;
  }

  getTenGvRadeByMaDT(maDT: string) {
    let result = [];
    let rades = this.listRade.filter((item) => item.maDt == maDT);
    // rades.forEach(item => result.push(this.listGiangvien.find(g => g.maGv == item.maGv)?.tenGv));
    for (let item of rades) {
      result.push(this.listGiangvien.find((g) => g.maGv == item.maGv)?.tenGv);
    }
    return result;
  }

  getTenGvDuyetByMaDT(maDT: string) {
    let result = [];
    let duyetdts = this.listDuyetDt.filter((item) => item.maDt == maDT);
    for (let item of duyetdts) {
      result.push(this.listGiangvien.find((g) => g.maGv == item.maGv)?.tenGv);
    }
    return result;
  }

  getThoiGianDuyetByMaDT(maDT: string) {
    let result = [];
    let duyetdts = this.listDuyetDt.filter((item) => item.maDt == maDT);
    if (duyetdts.length > 0) {
      const date = duyetdts.reduce((max, duyetdt) => {
        return new Date(duyetdt?.ngayDuyet) > max
          ? new Date(duyetdt?.ngayDuyet)
          : max;
      }, new Date(duyetdts[0]?.ngayDuyet));
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    }
    return 'Chưa duyệt!';
  }

  sortGiangVien(sort: string) {
    if (sort == 'asc-id') {
      this.listDT.sort((a, b) => a.maDT.localeCompare(b.maDT));
    } else if (sort == 'desc-id') {
      this.listDT.sort((a, b) => b.maDT.localeCompare(a.maDT));
    } else if (sort == 'asc-name') {
      this.listDT.sort((a, b) => a.tenDT.localeCompare(b.tenDT));
    } else if (sort == 'desc-name') {
      this.listDT.sort((a, b) => b.tenDT.localeCompare(a.tenDT));
    } else {
      this.deTaiService.getAll().subscribe((data) => {
        this.listDT = data;
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
    this.listDT = this.root.filter((item) =>
      item.tenDT.toLowerCase().includes(searchName)
    );
  }

  dateFormat(str: string): string {
    return this.shareService.dateFormat(str);
  }
}
