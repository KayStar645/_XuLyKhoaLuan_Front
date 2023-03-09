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
import { Form } from 'src/assets/utils';
import * as XLSX from 'xlsx';
// import * as FileSaver from 'file-saver';

@Component({
  selector: 'app-giangvien',
  templateUrl: './giangvien.component.html',
  styleUrls: ['./giangvien.component.scss'],
})
export class GiangvienComponent implements OnInit {
  @ViewChild(DanhsachgiangvienComponent)
  private DSGVComponent!: DanhsachgiangvienComponent;
  listBoMon: BoMon[] = [];
  gvUpdate: any = GiangVien;
  searchName = '';
  selectedBomon!: string;
  isAddFormActive: boolean = false;
  isUpdateFormActive: boolean = false;
  giangVienFile: any[] = [];

  gvAddForm: any;
  gvUpdateForm: any;

  gvForm = new Form({
    maGv: ['', Validators.required],
    maBm: ['', Validators.required],
    tenGv: ['', Validators.required],
    email: [''],
    ngaySinh: ['', Validators.required],
    ngayNhanViec: ['', Validators.required],
    gioiTinh: ['', Validators.required],
    hocHam: [''],
    sdt: [''],
    hocVi: [''],
    ngayNghi: [''],
  });

  constructor(
    private titleService: Title,
    private router: Router,
    private elementRef: ElementRef,
    private boMonService: boMonService,
    private giangVienService: giangVienService
  ) {
    this.gvAddForm = this.gvForm.form;
    this.gvUpdateForm = this.gvForm.form;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Danh sách giảng viên');
    this.boMonService.getAll().subscribe((data) => {
      this.listBoMon = data;
      if (data.length > 0) {
        this.selectedBomon = data[0].maBm;
      }
    });
    this.router.navigate(['/admin/giang-vien', 'danh-sach-giang-vien']);
    this.gvUpdate = this.DSGVComponent?.lineGV;
  }

  handleToggleAdd() {
    this.isAddFormActive = !this.isAddFormActive;
  }

  handleToggleUpdate() {
    this.gvForm.form.setValue({
      ...this.DSGVComponent.lineGV,
      ngayNhanViec: this.DSGVComponent.lineGV.ngayNhanViec.substring(0, 10),
      ngaySinh: this.DSGVComponent.lineGV.ngaySinh.substring(0, 10),
    });
    this.isUpdateFormActive = !this.isUpdateFormActive;
  }

  onBlur(event: any) {
    this.gvForm.inputBlur(event);
  }

  onInput(event: any) {
    let file = event.target.files[0];

    const fileReader = new FileReader();
    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (event) => {
      const arrayBuffer: any = fileReader.result;
      const data = new Uint8Array(arrayBuffer);
      const workBook = XLSX.read(data, { type: 'array' });
      const workSheet = workBook.Sheets[workBook.SheetNames[0]];
      const excelData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });

      this.giangVienFile = excelData;
    };
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
          console.log(data);

          this.DSGVComponent.getAllGiangVien();
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      this.gvForm.validate('#create_box');
    }
  }

  importGiangVien() {}

  updateGiangVien() {}

  deleteGiangVien() {}

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
