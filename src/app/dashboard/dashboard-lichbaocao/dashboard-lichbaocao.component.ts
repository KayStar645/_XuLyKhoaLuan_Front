import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard-lichbaocao',
  templateUrl: './dashboard-lichbaocao.component.html',
  styleUrls: ['./dashboard-lichbaocao.component.scss'],
})
export class DashboardLichbaocaoComponent {
  data: any[] = [];

  ngOnInit(): void {
    this.data = [
      {
        tenDT: 'Quản lý tiến trình khóa luận 1',
        thoiDiem: '2023-12-19T8:30:00.000Z',
        diaDia: 'Zoom 28',
      },
      {
        tenDT: 'Quản lý tiến trình khóa luận 2',
        thoiDiem: '2023-12-23T13:00:00.000Z',
        diaDia: 'Zoom 22',
      },
      {
        tenDT: 'Quản lý tiến trình khóa luận 3',
        thoiDiem: '2023-12-19T15:00:00.000Z',
        diaDia: 'Zoom 1',
      },
      {
        tenDT: 'Quản lý tiến trình khóa luận 4',
        thoiDiem: '2023-12-19T19:00:00.000Z',
        diaDia: 'Zoom 87',
      },
    ];
  }
}

