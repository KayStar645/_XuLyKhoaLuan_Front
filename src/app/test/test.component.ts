import { Component, OnInit } from '@angular/core';
import { BaoCao } from '../models/BaoCao.model';
import { BinhLuan } from '../models/BinhLuan.model';
import { PbCham } from '../models/PbCham.model';
import { baoCaoService } from '../services/baoCao.service';
import { binhLuanService } from '../services/binhLuan.service';
import { pbChamService } from '../services/pbCham.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html'
})
export class TestComponent implements OnInit {

  constructor(private binhLuanService : binhLuanService) { }

  ngOnInit(): void {
  }

  getAll() {
    this.binhLuanService.getAll().subscribe(data => {
      console.log("Get all: ");
      console.log(data);
    });
  }

  /*getById() {
    this.binhLuanService.getById(1).subscribe(data => {
      console.log(data);
    });
  }*/

  Add() {
    var binhLuan = new BinhLuan();
    binhLuan.dot = 1;
    binhLuan.id = 2;
    binhLuan.maCv = 'CV002';
    binhLuan.maSv = 'SV001';
    binhLuan.namHoc = '2020-2024';

    this.binhLuanService.add(binhLuan).subscribe(
      (success) => {
        console.log("Thêm oke!")
        console.log(success);
      },
      (error) => {
        console.log("Không oke rồi!")
        console.log(error);
      }
    );
  }

  Update() {
    var binhLuan = new BinhLuan();
    binhLuan.dot = 1;
    binhLuan.id = 2;
    binhLuan.maCv = 'CV002';
    binhLuan.maSv = 'SV001';
    binhLuan.namHoc = '2020-2024';
    binhLuan.noiDung = 'Đây là bình luận'

    this.binhLuanService.update(binhLuan).subscribe(
      (success) => {
        console.log("Upload oke!");
        console.log(success);
      },
      (error) => {
        console.log("Upload thất bại rồi!");
        console.log(error);
      }
    );
  }

  Delete() {
    this.binhLuanService.delete(2).subscribe(data => {
      console.log("Delete: ");
      console.log(data);
    });
  }
}