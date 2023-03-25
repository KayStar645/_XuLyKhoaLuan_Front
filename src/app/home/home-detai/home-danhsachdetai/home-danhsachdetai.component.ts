import { HomeMainComponent } from './../../home-main/home-main.component';
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
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { DeTai } from 'src/app/models/DeTai.model';
import { deTaiService } from 'src/app/services/deTai.service';
import { shareService } from 'src/app/services/share.service';
import { getParentElement } from 'src/assets/utils';

@Component({
  selector: 'app-home-danhsachdetai',
  templateUrl: './home-danhsachdetai.component.html',
  styleUrls: ['./home-danhsachdetai.component.scss']
})
export class HomeDanhsachdetaiComponent {
  @Input() searchName = '';
  @Input() isSelectedDT = false;
  @Output() returnIsSelectedDT = new EventEmitter<boolean>();
  listDT: DeTai[] = [];
  root: DeTai[] = [];
  selectedDT: string[] = [];
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
    private deTai_chuyenNganhService: deTai_chuyenNganhService,
  ) {}

  async ngOnInit() {
    this.getAllDeTai();

    this.listRade = await this.raDeService.getAll();
    this.listDuyetDt = await this.duyetDtService.getAll();
    this.listGiangvien = await this.giangVienService.getAll();
    this.listDeta_Chuyennganh = await this.deTai_chuyenNganhService.getAll();
    this.listChuyennganh = await this.chuyenNganhService.getAll();
  }

  async clickLine(event: any) {
    const parent = getParentElement(event.target, '.br-line');
    const firstChild = parent.firstChild;
    const activeLine = this.elementRef.nativeElement.querySelector(
      '.br-line.br-line-dblclick'
    );

    if (!parent.classList.contains('br-line-dblclick')) {
      this.lineDT = await this.deTaiService.getById(firstChild.innerText);

      activeLine && activeLine.classList.remove('br-line-dblclick');
      parent.classList.add('br-line-dblclick');
    } else {
      parent.classList.remove('br-line-dblclick');
      this.lineDT = new DeTai();
    }
  }

  getSelectedLine(e: any) {
    if (e.ctrlKey) {
      this.returnIsSelectedDT.emit(true);
      const activeDblClick = this.elementRef.nativeElement.querySelector(
        '.br-line.br-line-dblclick'
      );
      const parent = getParentElement(e.target, '.br-line');
      const firstChild = parent.firstChild;

      if (activeDblClick) {
        activeDblClick.classList.remove('.br-line-dblclick');
        this.lineDT = new DeTai();
      }

      if (parent.classList.contains('br-line-click')) {
        let childIndex = this.selectedDT.findIndex(
          (t) => t === firstChild.innerText
        );

        parent.classList.remove('br-line-click');
        this.selectedDT.splice(childIndex, 1);
      } else {
        parent.classList.add('br-line-click');
        this.selectedDT.push(firstChild.innerText);
      }

      if (this.selectedDT.length === 0) {
        this.returnIsSelectedDT.emit(false);
      }
    }
  }

  async onShowDetail(event: MouseEvent) {
    const parent = getParentElement(event.target, '.br-line');
    const firstChild = parent.firstChild;
    const activeLine = this.elementRef.nativeElement.querySelector(
      '.br-line.br-line-dblclick'
    );

    try {
      this.lineDT = await this.deTaiService.getById(firstChild.innerText);
      document.querySelector('.update-btn')?.dispatchEvent(new Event('click'));
    } catch (error) {
      console.log(error);
    }

    activeLine && activeLine.classList.remove('br-line-dblclick');
    parent.classList.add('br-line-dblclick');
  }

  async getAllDeTai() {
    try {
      const maKhoa = HomeMainComponent.maKhoa;
      const maBm = HomeMainComponent.maBm;
      const maGv = HomeMainComponent.maGV;
      if(maKhoa != null) {
        this.listDT = await this.deTaiService.GetAllDeTaisByMakhoa(maKhoa);
      }
      else if(maBm != null) {
        this.listDT = await this.deTaiService.GetAllDeTaisByMaBomon(maBm);
      }
      else {
        this.GetAllDeTaisByGiangvien(maGv);
      }
      this.root = this.listDT;
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
    } catch (error) {
      console.log(error);
    }
  }

  async GetAllDeTaisByGiangvien(maGv: string) {
    this.listDT = await this.deTaiService.GetAllDeTaisByGiangvien(maGv);
  }

  async getDetaiByMaCn(maCn: string) {
    this.listDT = await this.deTaiService.getByChuyenNganh(maCn);
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

