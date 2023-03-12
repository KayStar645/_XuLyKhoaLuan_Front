import { raDeService } from './../services/raDe.service';
import { DeTai_ChuyenNganh } from './../models/DeTai_ChuyenNganh.model';
import { Component, OnInit } from '@angular/core';
import { RaDe } from '../models/RaDe.model';


@Component({
  selector: 'app-test',
  templateUrl: './test.component.html'
})
export class TestComponent implements OnInit {

  constructor(private raDeService : raDeService) { }

  ngOnInit(): void {
  }

  getAll() {
    this.raDeService.getAll().subscribe(data => {
      console.log("Get all: ");
      console.log(data);
    });
  }

  getById() {
    this.raDeService.getById("GV00001", "DT0002").subscribe(
      (success) => {
        console.log("Lấy oke!")
        console.log(success);
      },
      (error) => {
        console.log("Lấy không oke rồi!")
        console.log(error);
      }
    );
  }

  Add() {
    var dtcn = new RaDe();
    dtcn.MaDt = "DT0002";
    dtcn.MaGv = "GV00001";

    this.raDeService.add(dtcn).subscribe(
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

  // Update() {
  //   var binhLuan = new BinhLuan();
  //   binhLuan.dot = 1;
  //   binhLuan.id = 2;
  //   binhLuan.maCv = 'CV002';
  //   binhLuan.maSv = 'SV001';
  //   binhLuan.namHoc = '2020-2024';
  //   binhLuan.noiDung = 'Đây là bình luận'

  //   this.binhLuanService.update(binhLuan).subscribe(
  //     (success) => {
  //       console.log("Upload oke!");
  //       console.log(success);
  //     },
  //     (error) => {
  //       console.log("Upload thất bại rồi!");
  //       console.log(error);
  //     }
  //   );
  // }

  Delete() {
    this.raDeService.delete("GV00001", "DT0002").subscribe(data => {
      console.log("Delete: ");
      console.log(data);
    });
  }
}