import { LichPhanBien } from 'src/app/models/VirtualModel/LichPhanBienModel';
import { lichPhanBienService } from './../../services/NghiepVu/lichphanbien.service';
import { Component, OnInit } from '@angular/core';
import { DashboardMainComponent } from '../dashboard-main/dashboard-main.component';
import { WebsocketService } from 'src/app/services/Websocket.service';

@Component({
   selector: 'app-dashboard-lichbaocao',
   templateUrl: './dashboard-lichbaocao.component.html',
})
export class DashboardLichbaocaoComponent implements OnInit {
   lichPhanBiens: LichPhanBien[] = [];

   constructor(
      private lichPhanVienService: lichPhanBienService,
      private websocketService: WebsocketService
   ) {}

   async ngOnInit(): Promise<void> {
      await this.getShedule();

      this.websocketService.startConnection();
      this.websocketService.receiveFromHuongDan(async (dataChange: boolean) => {
         if (dataChange) {
            await this.getShedule();
         }
      });
      this.websocketService.receiveFromPhanBien(async (dataChange: boolean) => {
         if (dataChange) {
            await this.getShedule();
         }
      });
   }

   async getShedule() {
      this.lichPhanBiens = await this.lichPhanVienService.GetLichPhanBienBySvAsync(
         DashboardMainComponent.maSV
      );
   }

   onSelectType() {}
}
