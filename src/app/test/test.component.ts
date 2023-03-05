import { giaoVuService } from './../services/giaoVu.service';
import { Component, OnInit } from '@angular/core';
import { GiaoVu } from '../models/GiaoVu.model';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
})
export class TestComponent implements OnInit {

  constructor(private giaoVuService: giaoVuService) { }

  ngOnInit(): void {
  }

  getAll() {
    this.giaoVuService.getAll().subscribe(data => {
      console.log("Get all: ");
      console.log(data);
    });
  }

  getById() {
    this.giaoVuService.getById('GV00001').subscribe(data => {
      console.log("Get by ID GV00001: ");
      console.log(data);
    });
  }

  Add() {
    var giaoVu = new GiaoVu();
    giaoVu.maGv = 'GV00002';
    giaoVu.tenGv = 'Trần Cao Lãnh';
    giaoVu.gioiTinh = 'Nam';
    giaoVu.ngaySinh = '1995-03-10';
    giaoVu.ngayNhanViec = '2020-10-05';
    giaoVu.email = 'lanhtc@hufi.edu.vn';
    giaoVu.sdt = '0384612484';
    giaoVu.maKhoa = 'CNTT';

    console.log(giaoVu);

    this.giaoVuService.add(giaoVu).subscribe(
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
    var giaoVu = new GiaoVu();
    giaoVu.maGv = 'GV00002';
    giaoVu.tenGv = 'Trần Cao Bằng';
    giaoVu.ngaySinh = '1995-10-22';

    this.giaoVuService.update(giaoVu).subscribe(
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
    this.giaoVuService.delete('GV00002').subscribe(data => {
      console.log("Delete: ");
      console.log(data);
    });
  }

}
