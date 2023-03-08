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
  styleUrls: ['./giangvien.component.scss']
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

  constructor(private titleService: Title, private router: Router,
    private elementRef: ElementRef, private boMonService: boMonService,
     private fb: FormBuilder, private giangVienService: giangVienService) {
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
    this.boMonService.getAll().subscribe(data => {
      this.listBoMon = data;
      if(data.length > 0) {
        this.selectedBomon = data[0].maBm;
      }
    });
    this.router.navigate(['/admin/giang-vien', 'danh-sach-giang-vien']);
    this.gvUpdate = this.DSGVComponent?.lineGV;
  }

  clickCreate() {
    const create = this.elementRef.nativeElement.querySelector('#create');
    const create_box = this.elementRef.nativeElement.querySelector('#create_box');
    if(!create.classList.contains("block")) {
      create.classList.add('block');
      create_box.classList.add('block');
    }
    else {
      create.classList.remove('block');
      create_box.classList.remove('block');
    }
  }

  clickUpdate() {
    const update = this.elementRef.nativeElement.querySelector('#update');
    const update_box = this.elementRef.nativeElement.querySelector('#update_box');
    if(!update.classList.contains("block")) {
      update.classList.add('block');
      update_box.classList.add('block');
    }
    else {
      update.classList.remove('block');
      update_box.classList.remove('block');
    }
  }

  clickDelete() {
    const _delete = this.elementRef.nativeElement.querySelector('#delete');
    const _delete_box = this.elementRef.nativeElement.querySelector('#delete_box');
    if(!_delete.classList.contains("block")) {
      _delete.classList.add('block');
      _delete_box.classList.add('block');
    }
    else {
      _delete.classList.remove('block');
      _delete_box.classList.remove('block');
    }
  }

  addGiangVien() {
    if(this.gvAddForm.valid) {
      const giangVien = new GiangVien();
      giangVien.init(this.gvAddForm.value["maGV"], this.gvAddForm.value["tenGV"],
       this.gvAddForm.value["ngaySinh"], this.gvAddForm.value["gioiTinh"],
        this.gvAddForm.value["email"], this.gvAddForm.value["sdt"],
         this.gvAddForm.value["hocHam"], this.gvAddForm.value["hocVi"],
          this.gvAddForm.value["ngayNhanViec"], '', this.gvAddForm.value["maBM"]);

      this.giangVienService.add(giangVien).subscribe(
        (data) => {
          this.DSGVComponent.getAllGiangVien();

      },
      (error) => {
        console.log(error);
        // Xử lý lỗi
      });

      // this.giangVienService.add(giangVien).subscribe(data => {
      //   console.log(data);
      //   this.DSGVComponent.getAllGiangVien();      
      // });
    }
    else {
      console.log("Không vô")
    }
  }

  importGiangVien() {

  }

  updateGiangVien() {
    // this.clickUpdate();
    console.log(this.gvUpdateForm.value)
  }

  deleteGiangVien() {
    // this.clickDelete();
  }

  getGiangVienByMaBM(event: any) {
    const maBM = event.target.value;
    if(maBM == '') {
      this.DSGVComponent.getAllGiangVien();
    }
    else {
      this.DSGVComponent.getGiangVienByMaBM(maBM);
    }
  }

  sortGiangVien(event: any) {
    const sort = event.target.value;
    this.DSGVComponent.sortGiangVien(sort);
  }

}
