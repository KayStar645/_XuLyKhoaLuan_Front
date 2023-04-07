import { Component, ElementRef } from '@angular/core';
import { NhiemVu } from 'src/app/models/NhiemVu.model';
import { nhiemVuService } from 'src/app/services/nhiemVu.service';
import { shareService } from 'src/app/services/share.service';
import { WebsocketService } from 'src/app/services/Websocket.service';

@Component({
  selector: 'app-dashboard-trangchunhom',
  templateUrl: './dashboard-trangchunhom.component.html',
  styleUrls: ['./dashboard-trangchunhom.component.scss'],
})
export class DashboardTrangchunhomComponent {
  listNV: any[] = [];
  selectedTB: string = 'adsad';
  root: NhiemVu[] = [];
  lineTB = new NhiemVu();
  elementOld: any;
  nearTimeOutMS: any[] = [];

  constructor(
    private nhiemVuService: nhiemVuService,
    private shareService: shareService,
  ) {}

  async ngOnInit() {
    await this.getAllNhiemVu();
  }

  async getAllNhiemVu() {
    this.listNV = await this.nhiemVuService.getAll();
    this.root = this.listNV;
  }

  dateFormat(str: string) {
    return this.shareService.dateFormat(str);
  }
}
