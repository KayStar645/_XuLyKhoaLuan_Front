import { async } from 'rxjs';
import { LichPhanBien } from 'src/app/models/VirtualModel/LichPhanBienModel';
import { lichPhanBienService } from './../../services/NghiepVu/lichphanbien.service';
import { Component, OnInit } from '@angular/core';
import { HomeMainComponent } from '../home-main/home-main.component';
import { WebsocketService } from 'src/app/services/Websocket.service';

@Component({
   selector: 'app-home-lichphanbien',
   templateUrl: './home-lichphanbien.component.html',
})
export class HomeLichphanbienComponent implements OnInit {
   lichPhanBiens: LichPhanBien[] = [];
   maGv = '';

   constructor(
      private lichPhanVienService: lichPhanBienService,
      private websocketService: WebsocketService
   ) {}

   async ngOnInit(): Promise<void> {
      this.maGv = HomeMainComponent.maGV;
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
      this.websocketService.ReceiveFromGapMatHd(async (dataChange: boolean) => {
         if (dataChange) {
            await this.getShedule();
         }
      });
   }

   async getShedule() {
      this.lichPhanBiens = await this.lichPhanVienService.GetLichPhanBienByGvAsync(
         HomeMainComponent.maGV
      );
   }
}
