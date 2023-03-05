import { QuanlychungComponent } from './../quanlychung/quanlychung.component';
import { Router } from '@angular/router';
import { Component, ElementRef, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-giangvien',
  templateUrl: './giangvien.component.html',
  styleUrls: ['./giangvien.component.scss']
})
export class GiangvienComponent implements OnInit {

  constructor(private titleService: Title, private router: Router,
    private elementRef: ElementRef,) { }

  ngOnInit(): void {
    this.titleService.setTitle('Danh sách giảng viên');
    this.router.navigate(['/admin/giang-vien', 'danh-sach-giang-vien']);
  }

  clickCreate() {
    const create = this.elementRef.nativeElement.querySelector('#create');
    if(!create.classList.contains("block")) {
      create.classList.add('block');
    }
    else {
      create.classList.remove('block');
    }
  }

  clickUpdate() {
    const update = this.elementRef.nativeElement.querySelector('#update');
    if(!update.classList.contains("block")) {
      update.classList.add('block');
    }
    else {
      update.classList.remove('block');
    }
  }

  clickDelete() {
    const _delete = this.elementRef.nativeElement.querySelector('#delete');
    if(!_delete.classList.contains("block")) {
      _delete.classList.add('block');
    }
    else {
      _delete.classList.remove('block');
    }
  }

  addGiangVien() {
    this.clickCreate();
  }

  importGiangVien() {

  }

  updateGiangVien() {
    this.clickUpdate();
  }

  deleteGiangVien() {
    this.clickDelete();
  }

}
