import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-home-baitap',
  templateUrl: './home-baitap.component.html',
  styleUrls: ['./home-baitap.component.scss'],
})
export class HomeBaitapComponent implements OnInit {
  maCv = '';
  maDt = '';
  maNhom = '';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.maCv = window.history.state['maCv'];
    this.maDt = window.history.state['maDt'];
    this.maNhom = window.history.state['maNhom'];
  }
  onChangeCurrent(event: any) {}

  onChangeInstruct(event: any) {}

  onClickAdd(event: any) {}
}
