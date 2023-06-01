import { WebsocketService } from 'src/app/services/Websocket.service';
import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { deTaiDiemService } from './../../services/NghiepVu/detaidiem.service';
import { DeTaiDiemVT } from 'src/app/models/VirtualModel/DeTaiDiemVTModel';
import { DashboardMainComponent } from '../dashboard-main/dashboard-main.component';

@Component({
   selector: 'app-dashboard-ketqua',
   templateUrl: './dashboard-ketqua.component.html',
   styleUrls: ['./dashboard-ketqua.component.scss'],
})
export class DashboardKetquaComponent {
   data: DeTaiDiemVT[] = [];
   len = 0;
   maSv = '';

   constructor(
      private titleService: Title,
      private deTaiDiemService: deTaiDiemService,
      private WebsocketService: WebsocketService
   ) {}

   async ngOnInit() {
      this.titleService.setTitle('Kết quả');
      this.maSv = DashboardMainComponent.maSV;
      this.data = await this.deTaiDiemService.GetDanhSachDiemBySv(this.maSv);

      this.WebsocketService.startConnection();
      this.WebsocketService.receiveFromDeTaiDiem(async (dataChange: boolean) => {
         this.data = await this.deTaiDiemService.GetDanhSachDiemBySv(this.maSv);
      });
   }
}
