import { Component, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ChuyenNganh } from 'src/app/models/ChuyenNganh.model';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { sinhVienService } from 'src/app/services/sinhVien.service';
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
    this.DSTGComponent.getThamgiaByMaCN(maCn);
  }
}
