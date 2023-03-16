import { shareService } from '../../../services/share.service';
import { giangVienService } from '../../../services/giangVien.service';
import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { boMonService } from 'src/app/services/boMon.service';
import { BoMon } from 'src/app/models/BoMon.model';
import { getParentElement } from 'src/assets/utils';

@Component({
  selector: 'app-danhsachgiangvien',
  templateUrl: './ministry-danhsachgiangvien.component.html',
  styleUrls: ['./ministry-danhsachgiangvien.component.scss'],
})
export class MinistryDanhsachgiangvienComponent implements OnInit {
  @Input() searchName = '';
  @Input() isSelectedGV = false;
  @Output() returnIsSelectedGV = new EventEmitter<boolean>();
  listBM: BoMon[] = [];
  root: GiangVien[] = [];
  lineGV = new GiangVien();
  elementOld: any;
  selectedGV: string[] = [];
  listGV: GiangVien[] = [];

  constructor(
    private giangVienService: giangVienService,
    private boMonService: boMonService,
    private shareService: shareService,
    private elementRef: ElementRef
  ) {}

  async ngOnInit() {
    this.getAllGiangVien();

    this.listBM = await this.boMonService.getAll();

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.selectedGV = [];
        this.returnIsSelectedGV.emit(false);
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

  getSelectedLine(event: any) {
    if (event.ctrlKey) {
      this.returnIsSelectedGV.emit(true);
      const activeDblClick = this.elementRef.nativeElement.querySelector(
        '.br-line.br-line-dblclick'
      );
      const parent = getParentElement(event.target, '.br-line');
      const firstChild = parent.firstChild;

      if (activeDblClick) {
        activeDblClick.classList.remove('.br-line-dblclick');
        this.lineGV = new GiangVien();
      }

      if (parent.classList.contains('br-line-click')) {
        let childIndex = this.selectedGV.findIndex(
          (t) => t === firstChild.innerText
        );

        parent.classList.remove('br-line-click');
        this.selectedGV.splice(childIndex, 1);
      } else {
        parent.classList.add('br-line-click');
        this.selectedGV.push(firstChild.innerText);
      }

      if (this.selectedGV.length === 0) {
        this.returnIsSelectedGV.emit(false);
      }
    }
  }

  async clickLine(event: any) {
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
      this.lineGV = await this.giangVienService.getById(mgv);
    }
  }

  async getAllGiangVien() {
    this.listGV = await this.giangVienService.getAll();
    this.root = this.listGV;
  }

  async getGiangVienByMaBM(maBM: string) {
    this.listGV = await this.giangVienService.getByBoMon(maBM);
  }

  async sortGiangVien(sort: string) {
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
      this.listGV = await this.giangVienService.getAll();
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
    let tenbbm: any = '';
    if (this.listBM) {
      tenbbm = this.listBM.find((t) => t.maBm === maBM)?.tenBm;
    }

    return tenbbm;
  }

  dateFormat(str: string): string {
    return this.shareService.dateFormat(str);
  }
}
