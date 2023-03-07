import { Component, OnInit } from '@angular/core';
import { ThamGiaHd } from '../models/ThamGiaHd.model';
import { thamGiaHdService } from '../services/thamGiaHD.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html'
})
export class TestComponent implements OnInit {

  constructor(private thamGiaHdService : thamGiaHdService) { }

  ngOnInit(): void {
  }

  getAll() {
    this.thamGiaHdService.getAll().subscribe(data => {
      console.log("Get all: ");
      console.log(data);
    });
  }

  getById() {
    this.thamGiaHdService.getById('GV0001', 'HD001').subscribe(data => {
      console.log("Thông tin sinh viên: ");
      console.log(data);
    });
  }

  Add() {
    var thamGiaHD = new ThamGiaHd();
    thamGiaHD.maGv = 'GV0002';
    thamGiaHD.maHd = 'HD001';
    thamGiaHD.maVt = 'VT002';


    console.log(thamGiaHD);

    this.thamGiaHdService.add(thamGiaHD).subscribe(
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
    var thamGiaHD = new ThamGiaHd();
    thamGiaHD.maGv = 'GV0002';
    thamGiaHD.maHd = 'HD001';
    thamGiaHD.maVt = 'VT001';

    this.thamGiaHdService.update(thamGiaHD).subscribe(
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
    this.thamGiaHdService.delete('GV0002','HD001').subscribe(data => {
      console.log("Delete: ");
      console.log(data);
    });
  }

}