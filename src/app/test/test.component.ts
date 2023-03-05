import { Component, OnInit } from '@angular/core';
import { DeTai } from '../models/DeTai.model';
import { GiangVien } from '../models/GiangVien.model';
import { deTaiService } from '../services/DeTai.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
})
export class TestComponent implements OnInit {

  constructor(private deTaiService: deTaiService) { }

  ngOnInit(): void {
  }

  getAll() {
    this.deTaiService.getAll().subscribe(data => {
      console.log("Get all: ");
      console.log(data);
    });
  }

  getById() {
    this.deTaiService.getById('DT001').subscribe(data => {
      console.log("Get by ID DT001: ");
      console.log(data);
    });
  }

  Add() {
    var detai = new DeTai();
    detai.maDT = 'DT001';
    detai.slMax = 3;
    detai.slMin = 2;
    detai.tenDT = 'Nghiên cứu ứng dụng Android';
    detai.tomTat = 'Tìm hiểu các chức năng'
    detai.trangThai = true;

    console.log(detai);

    this.deTaiService.add(detai).subscribe(
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
    var detai = new DeTai();
    detai.maDT = 'DT001';
    detai.tenDT = 'Nghiên cứu Java'

    this.deTaiService.update(detai).subscribe(
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
    this.deTaiService.delete('DT001').subscribe(data => {
      console.log("Delete: ");
      console.log(data);
    });
  }

}
