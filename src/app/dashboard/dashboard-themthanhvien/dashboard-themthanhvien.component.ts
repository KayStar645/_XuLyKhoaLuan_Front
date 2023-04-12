import { Nhom } from 'src/app/models/Nhom.model';
import { nhomService } from 'src/app/services/nhom.service';
import { ThamGia } from 'src/app/models/ThamGia.model';
import { thamGiaService } from './../../services/thamGia.service';
import { dotDkService } from './../../services/dotDk.service';
import { DotDk } from './../../models/DotDk.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ChuyenNganh } from 'src/app/models/ChuyenNganh.model';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { sinhVienService } from 'src/app/services/sinhVien.service';
import { getParentElement, Option } from 'src/assets/utils';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { DashboardDanhsachsinhvienComponent } from './dashboard-danhsachsinhvien/dashboard-danhsachsinhvien.component';
import { shareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-dashboard-themthanhvien',
  templateUrl: './dashboard-themthanhvien.component.html',
  styleUrls: ['./dashboard-themthanhvien.component.scss'],
})
export class DashboardThemthanhvienComponent implements OnInit {
  @ViewChild(DashboardDanhsachsinhvienComponent)
  protected DSTGComponent!: DashboardDanhsachsinhvienComponent;
  listChuyenNganh: ChuyenNganh[] = [];

  listSinhVien: SinhVien[] = [];

  searchName = '';
  selectedChuyenNganh!: string;

  constructor(
    private titleService: Title,
    private chuyenNganhService: chuyenNganhService,
    private sinhVienService: sinhVienService,
    private dotDkService: dotDkService,
    private websocketService: WebsocketService
  ) {}

  async ngOnInit() {
    this.titleService.setTitle('Danh sách sinh viên');
    this.listChuyenNganh = await this.chuyenNganhService.getAll();

    if (this.listChuyenNganh.length > 0) {
      this.selectedChuyenNganh = this.listChuyenNganh[0].maCn;
    }

    this.listSinhVien = await this.sinhVienService.getByDotDk(
      shareService.namHoc,
      shareService.dot,
      false
    );

    this.websocketService.startConnection();
  }

  getThamgiaByMaCN(event: any) {
    const maCn = event.target.value;
    if (maCn == '') {
      this.DSTGComponent.getAllThamgiaByDotdk();
    } else {
      this.DSTGComponent.getThamgiaByMaCN(maCn);
    }
  }

}