import { GiangVien } from 'src/app/models/GiangVien.model';
import { BoMon } from './../../models/BoMon.model';
import { boMonService } from './../../services/boMon.service';
import { DanhsachgiangvienComponent } from './danhsachgiangvien/danhsachgiangvien.component';
import { giangVienService } from './../../services/giangVien.service';
import { QuanlychungComponent } from './../quanlychung/quanlychung.component';
import { Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-giangvien',
  templateUrl: './giangvien.component.html',
  styleUrls: ['./giangvien.component.scss'],
})
export class GiangvienComponent implements OnInit {
  @ViewChild(DanhsachgiangvienComponent)
  private DSGVComponent!: DanhsachgiangvienComponent;
  listBoMon: BoMon[] = [];
  gvUpdate!: GiangVien;
  searchName = '';
  gvAddForm: FormGroup;
  gvUpdateForm: FormGroup;
  selectedBomon!: string;

  constructor(
    private titleService: Title,
    private router: Router,
    private elementRef: ElementRef,
    private boMonService: boMonService,
    private fb: FormBuilder,
    private giangVienService: giangVienService
  ) {
    this.gvUpdateForm = this.fb.group({
      maGV: ['', Validators.required],
      maBM: ['', Validators.required],
      tenGV: ['', Validators.required],
      email: [''],
      ngaySinh: [''],
      ngayNhanViec: ['', Validators.required],
      gioiTinh: ['', Validators.required],
      hocHam: [''],
      sdt: [''],
      hocVi: [''],
    });

    this.gvAddForm = this.fb.group({
      maGV: ['', Validators.required],
      maBM: ['', Validators.required],
      tenGV: ['', Validators.required],
      email: [''],
      ngaySinh: [''],
      ngayNhanViec: ['', Validators.required],
      gioiTinh: ['', Validators.required],
      hocHam: [''],
      sdt: [''],
      hocVi: [''],
    });
  }

  ngOnInit(): void {
    this.titleService.setTitle('Danh sách giảng viên');
    this.boMonService.getAll().subscribe((data) => {
      this.listBoMon = data;
      this.selectedBomon = data[0].maBm;
    });
    this.router.navigate(['/admin/giang-vien', 'danh-sach-giang-vien']);
    this.gvUpdate = this.DSGVComponent?.lineGV;
  }

  clickCreate() {
    const create = this.elementRef.nativeElement.querySelector('#create');
    const create_box =
      this.elementRef.nativeElement.querySelector('#create_box');
    if (!create.classList.contains('active')) {
      create.classList.add('active');
      create_box.classList.add('active');
    } else {
      create.classList.remove('active');
      create_box.classList.remove('active');
    }
  }

  clickUpdate() {
    const update = this.elementRef.nativeElement.querySelector('#update');
    const update_box =
      this.elementRef.nativeElement.querySelector('#update_box');
    if (!update.classList.contains('active')) {
      update.classList.add('active');
      update_box.classList.add('active');
    } else {
      update.classList.remove('active');
      update_box.classList.remove('active');
    }
  }

  clickDelete() {
    const _delete = this.elementRef.nativeElement.querySelector('#delete');
    const _delete_box =
      this.elementRef.nativeElement.querySelector('#delete_box');
    if (!_delete.classList.contains('active')) {
      _delete.classList.add('active');
      _delete_box.classList.add('active');
    } else {
      _delete.classList.remove('active');
      _delete_box.classList.remove('active');
    }
  }

  addGiangVien() {
    if (this.gvAddForm.valid) {
      const giangVien = new GiangVien();
      giangVien.init(
        this.gvAddForm.value['maGV'],
        this.gvAddForm.value['tenGV'],
        this.gvAddForm.value['ngaySinh'],
        this.gvAddForm.value['gioiTinh'],
        this.gvAddForm.value['email'],
        this.gvAddForm.value['sdt'],
        this.gvAddForm.value['hocHam'],
        this.gvAddForm.value['hocVi'],
        this.gvAddForm.value['ngayNhanViec'],
        '',
        this.gvAddForm.value['maBM']
      );

      this.giangVienService.add(giangVien).subscribe(
        (data) => {
          console.log('hiiiii');
          this.DSGVComponent.getAllGiangVien();
        },
        (error) => {
          console.log('hii');
          console.log(error);
        }
      );

    } else {
      console.log('Không vô');
    }
  }

  importGiangVien() {}

  updateGiangVien() {
    // this.clickUpdate();
    console.log(this.gvUpdateForm.value);
  }

  deleteGiangVien() {
    // this.clickDelete();
  }

  getGiangVienByMaBM(event: any) {
    const maBM = event.target.value;
    if (maBM == '') {
      this.DSGVComponent.getAllGiangVien();
    } else {
      this.DSGVComponent.getGiangVienByMaBM(maBM);
    }
  }

  sortGiangVien(event: any) {
    const sort = event.target.value;
    this.DSGVComponent.sortGiangVien(sort);
  }
}
