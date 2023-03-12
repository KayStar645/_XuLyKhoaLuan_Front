import { Component, Input, SimpleChanges } from '@angular/core';
import { BoMon } from 'src/app/models/BoMon.model';
import { DeTai } from 'src/app/models/DeTai.model';
import { boMonService } from 'src/app/services/boMon.service';
import { deTaiService } from 'src/app/services/deTai.service';
import { shareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-danhsachdetai',
  templateUrl: './danhsachdetai.component.html',
  styleUrls: ['./danhsachdetai.component.scss'],
})
export class DanhsachdetaiComponent {
  @Input() searchName = '';
  listDT: DeTai[] = [];
  root: DeTai[] = [];
  lineGV = new DeTai();
  elementOld: any;

  constructor(
    private deTaiService: deTaiService,
    private shareService: shareService
  ) {}

  ngOnInit(): void {
    this.getAllDeTai();
  }

  clickLine(event: any) {
    const element = event.target.parentNode;
    if (this.elementOld == element && this.lineGV.maDT != null) {
      this.elementOld.classList.remove('br-line-hover');
      this.lineGV = new DeTai();
    } else {
      if (this.elementOld != null) {
        this.elementOld.classList.remove('br-line-hover');
      }

      element.classList.add('br-line-hover');
      this.elementOld = element;

      const mgv = element.firstElementChild.innerHTML;
      this.deTaiService.getById(mgv).subscribe((data) => {
        this.lineGV = data;
      });
    }
  }

  getAllDeTai() {
    this.deTaiService.getAll().subscribe((data) => {
      this.listDT = data;
      this.root = data;
    });
  }

  getGiangVienByMaBM(maBM: string) {
    // this.deTaiService.getByBoMon(maBM).subscribe((data) => {
    //   this.listDT = data;
    // });
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
      // } else if (sort == 'asc-subject') {
      //   this.listDT.sort((a, b) => a.maBm.localeCompare(b.maBm));
      // } else if (sort == 'desc-subject') {
      //   this.listDT.sort((a, b) => b.maBm.localeCompare(a.maBm));
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
