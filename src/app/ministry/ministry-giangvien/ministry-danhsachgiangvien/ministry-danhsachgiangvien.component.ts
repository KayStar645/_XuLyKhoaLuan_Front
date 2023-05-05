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
import { WebsocketService } from 'src/app/services/Websocket.service';

@Component({
  selector: 'app-ministry-danhsachgiangvien',
  templateUrl: './ministry-danhsachgiangvien.component.html',
  // styleUrls: ['./ministry-danhsachgiangvien.component.scss'],
})
export class MinistryDanhsachgiangvienComponent implements OnInit {
  @Input() searchName = '';
  @Input() isSelectedGV = false;
  @Output() returnIsSelectedGV = new EventEmitter<boolean>();
  listBM: BoMon[] = [];
  root: GiangVien[] = [];
  lineGV = new GiangVien();
  elementOld: any;
  listGV: GiangVien[] = [];

  constructor(
    private giangVienService: giangVienService,
    private boMonService: boMonService,
    private shareService: shareService,
    private elementRef: ElementRef,
    private websocketService: WebsocketService
  ) {}

  async ngOnInit() {
    this.getAllGiangVien();

    this.listBM = await this.boMonService.getAll();

    this.websocketService.startConnection();
    this.websocketService.receiveFromGiangVien((dataChange: boolean) => {
      if (dataChange) {
        this.getAllGiangVien();
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

      if (activeDblClick) {
        activeDblClick.classList.remove('.br-line-dblclick');
        this.lineGV = new GiangVien();
      }
    }
  }

  async clickLine(event: any) {
    const parent = getParentElement(event.target, '.br-line');
    const firstChild = parent.firstChild;
    const activeLine = this.elementRef.nativeElement.querySelector(
      '.br-line.br-line-dblclick'
    );

    if (!parent.classList.contains('br-line-dblclick')) {
      this.lineGV = await this.giangVienService.getById(firstChild.innerText);

      activeLine && activeLine.classList.remove('br-line-dblclick');
      parent.classList.add('br-line-dblclick');
    } else {
      parent.classList.remove('br-line-dblclick');
      this.lineGV = new GiangVien();
    }
  }

  async getAllGiangVien() {
    this.listGV = await this.giangVienService.getAll();
    this.root = this.listGV;
  }

  async getGiangVienByMaBM(maBM: string) {
    this.listGV = await this.giangVienService.getByBoMon(maBM);
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
