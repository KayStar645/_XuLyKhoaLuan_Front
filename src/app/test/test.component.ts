import { GiangVien } from 'src/app/models/GiangVien.model';
import { giangVienService } from './../services/giangVien.service';
import { Component, OnInit } from '@angular/core';
import { HuongDan } from '../models/HuongDan.model';
import { VaiTro } from '../models/VaiTro.model';
import { vaiTroService } from '../services/vaiTro.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
})
export class TestComponent implements OnInit {

  constructor(private giangVienService : giangVienService) { }

  ngOnInit(): void {
  }

  Add() {
  const gv = new GiangVien();
  gv.init('magv', 'tengv', '2000-01-01', 'Nam', '', '', '', '', '2020-01-01', '', 'HTTT');
    
    console.log(gv);
    this.giangVienService.add(gv).subscribe(data => {
      console.log(data);
    });


  }

  getByBomon() {
    this.giangVienService.getByBoMon('VT001').subscribe(data => {
      console.log("Thông tin hướng dẫn: ");
      console.log(data);
    });
  }

}
