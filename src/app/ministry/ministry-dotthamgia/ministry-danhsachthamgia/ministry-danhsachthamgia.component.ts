import { thamGiaService } from './../../../services/thamGia.service';
import { ThamGia } from './../../../models/ThamGia.model';
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
import { WebsocketService } from 'src/app/services/Websocket.service';

@Component({
  selector: 'app-ministry-danhsachthamgia',
  templateUrl: './ministry-danhsachthamgia.component.html',
  // styleUrls: ['./ministry-danhsachthamgia.component.scss']
})
export class MinistryDanhsachthamgiaComponent implements OnInit {
  @Input() searchName = '';
  @Input() isSelectedTG = false;
  @Output() returnIsSelectedTG = new EventEmitter<boolean>();
  _searchName = '';
  _maCn = '';
  _namHoc = '';
  _dot = 0;

  listTg: ThamGia[] = [];
  sinhVien = new SinhVien();

  listSV: SinhVien[] = [];
  listCN: ChuyenNganh[] = [];
  selectedTG: any[] = [];
  lineTG = new ThamGia();
  elementOld: any;

  constructor(
    private sinhVienService: sinhVienService,
    private elementRef: ElementRef,
    private chuyenNganhService: chuyenNganhService,
    private shareService: shareService,
    private thamGiaService: thamGiaService,
    private websocketService: WebsocketService
  ) {}

  async ngOnInit() {
    this.listSV = await this.sinhVienService.getAll();
    this.getAllThamgiaByDotdk();
    this.listCN = await this.chuyenNganhService.getAll();

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.selectedTG = [];
        this.returnIsSelectedTG.emit(false);
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

    this.websocketService.startConnection();
    this.websocketService.receiveFromThamGia((dataChange: boolean) => {
      if (dataChange) {
        this.sinhVienService.getAll().then((data) => (this.listSV = data));
        this.getAllThamgiaByDotdk();
      }
    });
  }

  async clickLine(event: any) {
    const parent = getParentElement(event.target, '.br-line');
    const firstChild = parent.firstChild;
    const namHoc_Dot: string = parent.querySelector('.namhoc_dot').innerText;
    const namHoc = namHoc_Dot.substring(0, 9);
    const dot = parseInt(namHoc_Dot[namHoc_Dot.length - 1]);

    if (!parent.classList.contains('br-line-dblclick')) {
      this.lineTG = await this.thamGiaService.getById(
        firstChild.innerText,
        namHoc,
        dot
      );
      parent.classList.add('br-line-dblclick');
    } else {
      this.lineTG = new ThamGia();
      parent.classList.remove('br-line-dblclick');
    }
  }

  async getAllThamgiaByDotdk() {
    this.listTg = await this.thamGiaService.search(
      this._searchName,
      this._maCn,
      this._namHoc,
      this._dot
    );
  }

  async getThamgiaByMaCN(maCn: string) {
    this._maCn = maCn;
    this.listTg = await this.thamGiaService.search(
      this._searchName,
      this._maCn,
      this._namHoc,
      this._dot
    );
  }

  async getThamgiaByDotDk(dotdk: string) {
    this._namHoc = '';
    this._dot = 0;
    if (dotdk != '') {
      this._namHoc = dotdk.slice(0, dotdk.length - 1);
      this._dot = parseInt(dotdk.slice(dotdk.length - 1));
    }
    this.listTg = await this.thamGiaService.search(
      this._searchName,
      this._maCn,
      this._namHoc,
      this._dot
    );
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.searchName) {
      const name = this.searchName.trim().toLowerCase();
      this._searchName = name;

      this.listTg = await this.thamGiaService.search(
        this._searchName,
        this._maCn,
        this._namHoc,
        this._dot
      );
    }
  }

  getSelectedLine(e: any) {
    if (e.ctrlKey) {
      this.returnIsSelectedTG.emit(true);
      const activeDblClick = this.elementRef.nativeElement.querySelector(
        '.br-line.br-line-dblclick'
      );
      const parent = getParentElement(e.target, '.br-line');
      const firstChild = parent.firstChild;
      const namHoc_Dot: string = parent.querySelector('.namhoc_dot').innerText;
      const namHoc = namHoc_Dot.substring(0, 9);
      const dot = parseInt(namHoc_Dot[namHoc_Dot.length - 1]);

      if (activeDblClick) {
        activeDblClick.classList.remove('.br-line-dblclick');
        this.lineTG = new ThamGia();
      }

      if (parent.classList.contains('br-line-click')) {
        let childIndex = this.selectedTG.findIndex(
          (t) => t === firstChild.innerText
        );

        parent.classList.remove('br-line-click');
        this.selectedTG.splice(childIndex, 1);
      } else {
        parent.classList.add('br-line-click');
        var idTg = {
          maSv: firstChild.innerText,
          namHoc: namHoc,
          dot: dot,
        };
        this.selectedTG.push(idTg);
      }

      if (this.selectedTG.length === 0) {
        this.returnIsSelectedTG.emit(false);
      }
    }
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
