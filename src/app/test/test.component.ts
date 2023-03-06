import { Component, OnInit } from '@angular/core';
import { HuongDan } from '../models/HuongDan.model';
import { VaiTro } from '../models/VaiTro.model';
import { vaiTroService } from '../services/vaiTro.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
})
export class TestComponent implements OnInit {

  constructor(private vaiTroService : vaiTroService) { }

  ngOnInit(): void {
  }

  getAll() {
    this.vaiTroService.getAll().subscribe(data => {
      console.log("Get all: ");
      console.log(data);
    });
  }

  getById() {
    this.vaiTroService.getById('VT001').subscribe(data => {
      console.log("Thông tin hướng dẫn: ");
      console.log(data);
    });
  }

  Add() {
    var vaitro = new VaiTro();
    vaitro.maVt = 'VT003';
    vaitro.tenVaiTro = 'Bình thường';

    console.log(vaitro);

    this.vaiTroService.add(vaitro).subscribe(
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
    var vaitro = new VaiTro();
    vaitro.maVt = 'VT003';
    vaitro.tenVaiTro = 'Bình 0 thường'

    this.vaiTroService.update(vaitro).subscribe(
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
    this.vaiTroService.delete('VT003').subscribe(data => {
      console.log("Delete: ");
      console.log(data);
    });
  }

}
