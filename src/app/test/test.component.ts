import { Component, OnInit } from '@angular/core';
import { DotDk } from '../models/DotDk.model';
import { Khoa } from '../models/Khoa.model';
import { khoaService } from '../services/khoa.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
})
export class TestComponent implements OnInit {

  constructor(private khoaService: khoaService) { }

  ngOnInit(): void {
  }

  getAll() {
    this.khoaService.getAll().subscribe(data => {
      console.log("Get all: ");
      console.log(data);
    });
  }

  getById() {
    this.khoaService.getById('CNTT').subscribe(data => {
      console.log("Thông tin khoa CNTT: ");
      console.log(data);
    });
  }

  Add() {
    var khoa = new Khoa();
    khoa.maKhoa = "PTDL";
    khoa.email = "ptdl@gmail.com";
    khoa.phong = "B103";
    khoa.sdt = "035261";
    khoa.tenKhoa = "Phân tích dữ liệu";

    console.log(khoa);

    this.khoaService.add(khoa).subscribe(
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
    var khoa = new Khoa();
    khoa.maKhoa = "PTDL";
    khoa.phong = "B109";
    khoa.sdt = "035261";
    khoa.tenKhoa = "Phân tích";
    

    this.khoaService.update(khoa).subscribe(
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
    this.khoaService.delete('PTDL').subscribe(data => {
      console.log("Delete: ");
      console.log(data);
    });
  }

}
