import { GiangVien } from 'src/app/models/GiangVien.model';
import { BoMon } from './../../models/BoMon.model';
import { boMonService } from './../../services/boMon.service';
import { DanhsachgiangvienComponent } from './danhsachgiangvien/danhsachgiangvien.component';
import { giangVienService } from './../../services/giangVien.service';
import { Router } from '@angular/router';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Validators } from '@angular/forms';
import { Form, getParentElement, Option } from 'src/assets/utils';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { userService } from 'src/app/services/user.service';
import { User } from 'src/app/models/User.model';

@Component({
  selector: 'app-giangvien',
  templateUrl: './giangvien.component.html',
  styleUrls: ['./giangvien.component.scss'],
})
export class GiangvienComponent implements OnInit {
  @ViewChild(DanhsachgiangvienComponent)
  private DSGVComponent!: DanhsachgiangvienComponent;
  listBoMon: BoMon[] = [];
  searchName = '';
  selectedBomon!: string;
  giangVienFile: any;

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
    private toastr: ToastrService,
    private userService: userService
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
  }

  onShowFormAdd() {
    let createBox = this.elementRef.nativeElement.querySelector('#create_box');
    let create = this.elementRef.nativeElement.querySelector('#create');

    createBox.classList.add('active');
    create.classList.add('active');
    this.gvForm.resetForm('#create_box');
  }

  onShowFormUpdate() {
    let updateBox = this.elementRef.nativeElement.querySelector('#update_box');
    let update = this.elementRef.nativeElement.querySelector('#update');

    if (Object.entries(this.DSGVComponent.lineGV).length > 0) {
      this.gvForm.form.setValue({
        ...this.DSGVComponent.lineGV,
        ngayNhanViec: this.DSGVComponent.lineGV.ngayNhanViec.substring(0, 10),
        ngaySinh: this.DSGVComponent.lineGV.ngaySinh.substring(0, 10),
        ngayNghi:
          this.DSGVComponent.lineGV.ngayNghi &&
          this.DSGVComponent.lineGV.ngayNghi.substring(0, 10),
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

    if (this.gvForm.isHaveValue()) {
      let option = new Option('#create_box');

      option.show('warning');

      option.cancel();

      option.agree(() => {
        this.gvForm.resetForm('#create_box');
        createBox.classList.remove('active');
        create.classList.remove('active');
      });
    } else {
      createBox.classList.remove('active');
      create.classList.remove('active');
    }
  }

  handleToggleUpdate() {
    let updateBox = this.elementRef.nativeElement.querySelector('#update_box');
    let update = this.elementRef.nativeElement.querySelector('#update');

    if (
      JSON.stringify(this.gvOldForm) !== JSON.stringify(this.gvForm.form.value)
    ) {
      let option = new Option('#update_box');

      option.show('warning');

      option.cancel();

      option.agree(() => {
        updateBox.classList.remove('active');
        update.classList.remove('active');
        this.gvForm.resetValidte('#update_box');
      });

      option.save(() => {
        this.updateGiangVien();
        update.classList.remove('active');
        updateBox.classList.remove('active');
      });
    } else {
      update.classList.remove('active');
      updateBox.classList.remove('active');
    }
  }

  onBlur(event: any) {
    this.gvForm.inputBlur(event);
  }

  onDragFileEnter(event: any) {
    event.preventDefault();
    const parent = getParentElement(event.target, '.drag-form');

    parent.classList.add('active');
  }

  onDragFileOver(event: any) {
    event.preventDefault();
    event.target.classList.add('active');
  }

  onDragFileLeave(event: any) {
    event.preventDefault();
    event.target.classList.remove('active');
  }

  onDropFile(event: any) {
    event.preventDefault();
    let file = event.dataTransfer.files[0];
    this.readExcelFile(file);
  }

  onFileInput(event: any) {
    let file = event.target.files[0];

    this.readExcelFile(file);
  }

  readExcelFile(file: any) {
    const fileReader = new FileReader();

    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (event) => {
      const arrayBuffer: any = fileReader.result;
      const data = new Uint8Array(arrayBuffer);
      const workBook = XLSX.read(data, { type: 'array' });
      const workSheet = workBook.Sheets[workBook.SheetNames[0]];
      const excelData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
      const datas = excelData
        .slice(1, excelData.length)
        .filter((data: any) => data.length > 0);
      datas.forEach((data: any, i) => {
        data[2] = data[2] ? XLSX.SSF.format('yyyy-MM-dd', data[2]) : undefined;
        data[8] = data[8] ? XLSX.SSF.format('yyyy-MM-dd', data[8]) : undefined;
        data[9] = data[9] ? XLSX.SSF.format('yyyy-MM-dd', data[9]) : undefined;
      });
      this.giangVienFile = {
        name: file.name,
        size: (file.size / 1024).toFixed(2) + 'MB',
        data: datas,
      };
    };
  }

  onSelect() {
    let input = this.elementRef.nativeElement.querySelector(
      '#drag-file_box input[type=file]'
    );

    input.click();
  }

  onCloseDrag(event: any) {
    let dragBox = this.elementRef.nativeElement.querySelector('#drag-file_box');

    event.target.classList.remove('active');
    dragBox.classList.remove('active');
  }

  onReadFile() {
    if (this.giangVienFile.data.length > 0) {
      const datas = this.giangVienFile.data;

      datas.forEach((data: any) => {
        let gv = new GiangVien();
        gv.init(
          data[0] ? data[0] : '',
          data[1] ? data[1] : '',
          data[2] ? data[2] : '',
          data[3] ? data[3] : '',
          data[4] ? data[4] : '',
          data[5] ? data[5] : '',
          data[6] ? data[6] : '',
          data[7] ? data[7] : '',
          data[8] ? data[8] : '',
          data[9] ? data[9] : '',
          data[10] ? data[10] : ''
        );
        this.giangVienService.add(gv).subscribe(
          (data) => {
            // Add tai khoan
            this.userService.addTeacher(new User(gv.maGv, gv.maGv)).subscribe(
              (success) => {},
              (error) => {
                console.log(error);
              }
            );
            this.toastr.success('Thêm giảng viên thành công', 'Thông báo !');
          },
          (error) => {
            this.toastr.error(
              'Thông tin bạn cung cấp không hợp lệ.',
              'Thông báo !'
            );
          }
        );
      });

      this.DSGVComponent.getAllGiangVien();
    }
  }

  clickDelete() {
    const _delete = this.elementRef.nativeElement.querySelector('#delete');

    if (Object.entries(this.DSGVComponent.lineGV).length > 0) {
      _delete.classList.add('active');
      let option = new Option('#delete');

      option.show('error', () => {
        _delete.classList.remove('active');
      });

      option.cancel(() => {
        _delete.classList.remove('active');
      });

      option.agree(() => {
        this.giangVienService.delete(this.DSGVComponent.lineGV.maGv).subscribe(
          (data) => {
            this.userService.delete(this.DSGVComponent.lineGV.maGv).subscribe(
              (success) => {},
              (error) => {
                console.log(error);
              }
            );
            this.toastr.success('Xóa giảng viên thành công', 'Thông báo !');
            this.DSGVComponent.lineGV = new GiangVien();
            this.DSGVComponent.getAllGiangVien();
          },
          (error) => {
            this.toastr.error(
              'Xóa giảng viên thất bại, vui lòng cập nhập ngày nghỉ thay vì xóa',
              'Thông báo !'
            );
          }
        );
        _delete.classList.remove('active');
      });
    } else {
      this.toastr.warning('Vui lòng chọn giảng viên để xóa', 'Thông báo !');
    }
    this.toastr.clear();
  }

  addGiangVien() {
    if (this.gvAddForm.valid) {
      const giangVien = new GiangVien();
      const taiKhoan = new User(
        this.gvAddForm.value['maGv'],
        this.gvAddForm.value['maGv']
      );
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
          this.gvForm.resetForm('#create_box');
          // Add tai khoan
          this.userService
            .addTeacher(new User(giangVien.maGv, giangVien.maGv))
            .subscribe(
              (success) => {},
              (error) => {
                console.log(error);
              }
            );
          this.toastr.success('Thêm giảng viên thành công', 'Thông báo !');
          this.DSGVComponent.getAllGiangVien();
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

  onShowFormDrag() {
    let drag = this.elementRef.nativeElement.querySelector('#drag-file');
    let dragBox = this.elementRef.nativeElement.querySelector('#drag-file_box');

    drag.classList.add('active');
    dragBox.classList.add('active');
  }

  resetLineActive() {
    this.DSGVComponent.lineGV = new GiangVien();
    this.elementRef.nativeElement
      .querySelector('.table tr.br-line-hover')
      .classList.remove('br-line-hover');
  }

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
          this.gvUpdateForm.value['ngayNghi'],
          this.gvUpdateForm.value['maBm']
        );

        this.giangVienService.update(giangVien).subscribe(
          (data) => {
            update.classList.remove('active');
            updateBox.classList.remove('active');
            this.DSGVComponent.getAllGiangVien();
            this.resetLineActive();
            this.toastr.success(
              'Cập nhập thông tin giảng viên viên thành công',
              'Thông báo !'
            );
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
