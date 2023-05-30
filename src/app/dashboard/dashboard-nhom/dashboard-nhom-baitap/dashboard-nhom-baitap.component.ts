import { Component, OnInit } from '@angular/core';

@Component({
   selector: 'app-dashboard-nhom-baitap',
   templateUrl: './dashboard-nhom-baitap.component.html',
   styleUrls: ['./dashboard-nhom-baitap.component.scss'],
})
export class DashboardNhomBaitapComponent implements OnInit {
   maCv = '';
   maDt = '';
   maNhom = '';

   ngOnInit(): void {
      this.maCv = window.history.state['maCv'];
      this.maDt = window.history.state['maDt'];
      this.maNhom = window.history.state['maNhom'];
   }
}
