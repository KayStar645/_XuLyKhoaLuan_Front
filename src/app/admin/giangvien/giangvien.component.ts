import { GiangVien } from 'src/app/models/GiangVien.model';
import { BoMon } from './../../models/BoMon.model';
import { boMonService } from './../../services/boMon.service';
import { DanhsachgiangvienComponent } from './danhsachgiangvien/danhsachgiangvien.component';
import { giangVienService } from './../../services/giangVien.service';
import { QuanlychungComponent } from './../quanlychung/quanlychung.component';
import { Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Validators } from '@angular/forms';
import { Form } from 'src/assets/utils';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
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
  giangVienFile: any[] = [];

  gvAddForm: any;
  gvUpdateForm: any;
  gvOldForm: any;

  gvForm = new Form({
    maGv: ['', Validators.required],
    maBm: ['', Validators.required],
    tenGv: ['', Validators.required],
    email: ['', Validators.email],
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
    private giangVienService: giangVienService,
    private toastr: ToastrService
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

  onShowFormAdd() {
    let createBox = this.elementRef.nativeElement.querySelector('#create_box');
    let create = this.elementRef.nativeElement.querySelector('#create');

    createBox.classList.add('active');
    create.classList.add('active');
  }

  onShowFormUpdate() {
    let updateBox = this.elementRef.nativeElement.querySelector('#update_box');
    let update = this.elementRef.nativeElement.querySelector('#update');

    // this.gvForm.form.get('maGv')?.disable();

    if (Object.entries(this.DSGVComponent.lineGV).length > 0) {
      this.gvForm.form.setValue({
        ...this.DSGVComponent.lineGV,
        ngayNhanViec: this.DSGVComponent.lineGV.ngayNhanViec.substring(0, 10),
        ngaySinh: this.DSGVComponent.lineGV.ngaySinh.substring(0, 10),
      });

      updateBox.classList.add('active');
      update.classList.add('active');
      this.gvOldForm = this.gvForm.form.value;
    } else {
      this.toastr.warning(
        'Vui lòng chọn giảng viên để cập nhập thông tin',
        'Thông báo !'
      );
    }
  }

  handleToggleAdd() {
    let createBox = this.elementRef.nativeElement.querySelector('#create_box');
    let create = this.elementRef.nativeElement.querySelector('#create');
    let notify = this.elementRef.nativeElement.querySelector(
      '#create_box .form-notify'
    );
    const cancel = this.elementRef.nativeElement.querySelector(
      '#create_box .cancel'
    );
    const agree =
      this.elementRef.nativeElement.querySelector('#create_box .agree');

    if (this.gvForm.isHaveValue('#create_box')) {
      notify.classList.add('active');

      cancel.addEventListener('click', () => {
        notify.classList.remove('active');
      });

      agree.addEventListener('click', () => {
        this.gvForm.resetForm('#create_box');
        createBox.classList.remove('active');
        create.classList.remove('active');
        notify.classList.remove('active');
      });
    } else {
      createBox.classList.remove('active');
      create.classList.remove('active');
    }
  }

  handleToggleUpdate() {
    let updateBox = this.elementRef.nativeElement.querySelector('#update_box');
    let update = this.elementRef.nativeElement.querySelector('#update');
    let notify = this.elementRef.nativeElement.querySelector(
      '#update_box .form-notify'
    );

    if (this.gvOldForm !== this.gvForm.form.value) {
      const cancel = this.elementRef.nativeElement.querySelector(
        '#update_box .cancel'
      );
      const agree =
        this.elementRef.nativeElement.querySelector('#update_box .agree');
      const save =
        this.elementRef.nativeElement.querySelector('#update_box .save');
      const progress = updateBox.querySelector('.progress-bar');

      notify.classList.add('active');
      setTimeout(() => {
        progress.classList.remove('active');
      }, 3500);

      cancel.addEventListener('click', () => {
        notify.classList.remove('active');
      });

      agree.addEventListener('click', () => {
        updateBox.classList.remove('active');
        update.classList.remove('active');
        notify.classList.remove('active');
      });

      save.addEventListener('click', () => {
        this.updateGiangVien();
        update.classList.remove('active');
        updateBox.classList.remove('active');
        notify.classList.remove('active');
      });
    } else {
      update.classList.remove('active');
      updateBox.classList.remove('active');
    }
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
        this.gvAddForm.value['maGv'],
        this.gvAddForm.value['tenGv'],
        this.gvAddForm.value['ngaySinh'],
        this.gvAddForm.value['gioiTinh'],
        this.gvAddForm.value['email'],
        this.gvAddForm.value['sdt'],
        this.gvAddForm.value['hocHam'],
        this.gvAddForm.value['hocVi'],
        this.gvAddForm.value['ngayNhanViec'],
        '',
        this.gvAddForm.value['maBm']
      );

      this.giangVienService.add(giangVien).subscribe(
        (data) => {
          this.DSGVComponent.getAllGiangVien();
          this.gvForm.resetForm('#create_box');
        },
        (error) => {
          this.toastr.error(
            'Thông tin bạn cung cấp không hợp lệ.',
            'Thông báo !'
          );
        }
      );
    } else {
      this.gvForm.validate('#create_box');
    }
  }

  importGiangVien() {}

  updateGiangVien() {
    let update = this.elementRef.nativeElement.querySelector('#update');
    let updateBox = this.elementRef.nativeElement.querySelector('#update_box');
    if (this.gvUpdateForm.valid) {
      if (this.gvOldForm === this.gvForm.form.value) {
        this.toastr.warning(
          'Thông tin bạn cung cấp không thay đổi kể từ lần cuối cập nhập.',
          'Thông báo !'
        );
      } else if (this.gvOldForm !== this.gvForm.form.value) {
        const giangVien = new GiangVien();
        giangVien.init(
          this.gvUpdateForm.value['maGv'],
          this.gvUpdateForm.value['tenGv'],
          this.gvUpdateForm.value['ngaySinh'],
          this.gvUpdateForm.value['gioiTinh'],
          this.gvUpdateForm.value['email'],
          this.gvUpdateForm.value['sdt'],
          this.gvUpdateForm.value['hocHam'],
          this.gvUpdateForm.value['hocVi'],
          this.gvUpdateForm.value['ngayNhanViec'],
          '',
          this.gvUpdateForm.value['maBm']
        );

        this.giangVienService.update(giangVien).subscribe(
          (data) => {
            this.DSGVComponent.getAllGiangVien();
            this.toastr.success(
              'Cập nhập thông tin nhân viên thành công',
              'Thông báo !'
            );
            update.classList.remove('active');
            updateBox.classList.remove('active');
          },
          (error) => {
            this.toastr.error(
              'Thông tin bạn cung cấp không hợp lệ.',
              'Thông báo !'
            );
          }
        );
      }
    } else {
      this.gvForm.validate('#update_box');
    }
  }

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
