import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ChuyenNganh } from 'src/app/models/ChuyenNganh.model';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { sinhVienService } from 'src/app/services/sinhVien.service';
import { Form, getParentElement, Option } from 'src/assets/utils';
import * as XLSX from 'xlsx';
import { MinistryDanhsachsinhvienComponent } from './ministry-danhsachsinhvien/ministry-danhsachsinhvien.component';
import { WebsocketService } from 'src/app/services/Websocket.service';

@Component({
  selector: 'app-ministry-sinhvien',
  templateUrl: './ministry-sinhvien.component.html',
})
export class MinistrySinhvienComponent implements OnInit {
  @ViewChild(MinistryDanhsachsinhvienComponent)
  protected DSSVComponent!: MinistryDanhsachsinhvienComponent;
  listChuyenNganh: ChuyenNganh[] = [];
  searchName = '';
  selectedChuyenNganh!: string;
  isSelectedSV: boolean = false;

  namHoc!: string;
  dot!: number;

  sinhVienFile: any;

  svAddForm: any;
  svUpdateForm: any;
  svOldForm: any;

  svForm = new Form({
    maSv: ['', Validators.required],
    tenSv: ['', Validators.required],
    email: ['', Validators.email],
    ngaySinh: [''],
    gioiTinh: ['', Validators.required],
    sdt: [''],
    lop: ['', Validators.required],
    maCn: ['', Validators.required],
  });

  constructor(
    private titleService: Title,
    private elementRef: ElementRef,
    private chuyenNganhService: chuyenNganhService,
    private sinhVienService: sinhVienService,
    private toastr: ToastrService,
    private websocketService: WebsocketService
  ) {
    this.svAddForm = this.svForm.form;
    this.svUpdateForm = this.svForm.form;
  }

  async ngOnInit() {
    this.titleService.setTitle('Danh sách sinh viên');
    this.listChuyenNganh = await this.chuyenNganhService.getAll();
    if (this.listChuyenNganh.length > 0) {
      this.selectedChuyenNganh = this.listChuyenNganh[0].maCn;
    }

    this.websocketService.startConnection();
  }

  setIsSelectedSv(event: any) {
    this.isSelectedSV = event;
  }

  onShowFormAdd() {
    let createBox = this.elementRef.nativeElement.querySelector('#create_box');
    let create = this.elementRef.nativeElement.querySelector('#create');

    document.documentElement.classList.add('no-scroll');
    createBox.classList.add('active');
    create.classList.add('active');
    this.svForm.resetForm('#create_box');
  }

  onShowFormUpdate() {
    let updateBox = this.elementRef.nativeElement.querySelector('#update_box');
    let update = this.elementRef.nativeElement.querySelector('#update');

    if (Object.entries(this.DSSVComponent.lineSV).length > 0) {
      this.svForm.form.setValue({
        ...this.DSSVComponent.lineSV,
        ngaySinh: this.DSSVComponent.lineSV.ngaySinh.substring(0, 10),
      });

      document.documentElement.classList.add('no-scroll');
      updateBox.classList.add('active');
      update.classList.add('active');
      this.svOldForm = this.svForm.form.value;
    } else {
      this.toastr.warning(
        'Vui lòng chọn sinh viên để cập nhập thông tin',
        'Thông báo !'
      );
    }
  }

  handleToggleAdd() {
    let createBox = this.elementRef.nativeElement.querySelector('#create_box');
    let create = this.elementRef.nativeElement.querySelector('#create');

    if (this.svForm.isHaveValue()) {
      let option = new Option('#create_box');

      option.show('warning');

      option.cancel();

      option.agree(() => {
        this.svForm.resetForm('#create_box');
        createBox.classList.remove('active');
        create.classList.remove('active');
        document.documentElement.classList.remove('no-scroll');
      });
    } else {
      createBox.classList.remove('active');
      create.classList.remove('active');
      document.documentElement.classList.remove('no-scroll');
    }
  }

  handleToggleUpdate() {
    let updateBox = this.elementRef.nativeElement.querySelector('#update_box');
    let update = this.elementRef.nativeElement.querySelector('#update');

    if (
      JSON.stringify(this.svOldForm) !== JSON.stringify(this.svForm.form.value)
    ) {
      let option = new Option('#update_box');

      option.show('warning');

      option.cancel();

      option.agree(() => {
        updateBox.classList.remove('active');
        update.classList.remove('active');
        this.svForm.resetValidte('#update_box');
        document.documentElement.classList.remove('no-scroll');
      });

      option.save(() => {
        this.updateSinhVien();
        update.classList.remove('active');
        updateBox.classList.remove('active');
        document.documentElement.classList.remove('no-scroll');
      });
    } else {
      update.classList.remove('active');
      updateBox.classList.remove('active');
      document.documentElement.classList.remove('no-scroll');
    }
  }

  onBlur(event: any) {
    this.svForm.inputBlur(event);
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
      });
      this.sinhVienFile = {
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
    document.documentElement.classList.remove('no-scroll');
    dragBox.classList.remove('active');
  }

  async onReadFile() {
    if (this.sinhVienFile.data.length > 0) {
      const datas = this.sinhVienFile.data;

      for (let data of datas) {
        let sinhVien = new SinhVien();
        sinhVien.init(
          data[0] ? JSON.stringify(data[0]) : '',
          data[1] ? data[1] : '',
          data[2] ? data[2] : '',
          data[3] ? data[3] : '',
          data[4] ? data[4] : '',
          data[5] ? data[5] : '',
          data[6] ? data[6] : '',
          data[7] ? data[7] : ''
        );
        await this.f_AddSinhVien(sinhVien);
      }

      this.websocketService.sendForSinhVien(true);
    }
  }

  async clickDelete() {
    const _delete = this.elementRef.nativeElement.querySelector('#delete');

    if (Object.entries(this.DSSVComponent.lineSV).length > 0) {
      _delete.classList.add('active');
      let option = new Option('#delete');

      option.show('error', () => {
        _delete.classList.remove('active');
      });

      option.cancel(() => {
        _delete.classList.remove('active');
      });

      option.agree(async () => {
        try {
          await this.sinhVienService.delete(this.DSSVComponent.lineSV.maSv);

          this.DSSVComponent.lineSV = new SinhVien();
          this.toastr.success('Xóa sinh viên thành công', 'Thông báo !');
          document.documentElement.classList.remove('no-scroll');
        } catch (error) {
          this.toastr.error(
            'Xóa sinh viên thất bại, vui lòng cập nhập ngày nghỉ thay vì xóa',
            'Thông báo !'
          );
        }
        _delete.classList.remove('active');
      });
    } else if (
      Object.entries(this.DSSVComponent.lineSV).length === 0 &&
      this.DSSVComponent.selectedSV.length === 0
    ) {
      this.toastr.warning('Vui lòng chọn sinh viên để xóa', 'Thông báo !');
    }

    this.DSSVComponent.selectedSV.forEach((maSV) => {
      try {
        this.sinhVienService.delete(maSV);
        this.toastr.success('Xóa sinh viên thành công', 'Thông báo !');
        this.DSSVComponent.lineSV = new SinhVien();
        this.isSelectedSV = false;
      } catch (error) {
        this.toastr.error('Xóa sinh viên thất bại', 'Thông báo !');
      }
    });

    this.DSSVComponent.selectedSV = [];
    this.websocketService.sendForSinhVien(true);
  }

  addSinhVien() {
    if (this.svAddForm.valid) {
      const sinhVien = new SinhVien();
      sinhVien.init(
        this.svAddForm.value['maSv'],
        this.svAddForm.value['tenSv'],
        this.svAddForm.value['ngaySinh'],
        this.svAddForm.value['gioiTinh'],
        this.svAddForm.value['lop'],
        this.svAddForm.value['sdt'],
        this.svAddForm.value['email'],
        this.svAddForm.value['maCn']
      );
      this.f_AddSinhVien(sinhVien);
      this.websocketService.sendForSinhVien(true);
    } else {
      this.svForm.validate('#create_box');
    }
  }

  async f_AddSinhVien(sv: SinhVien) {
    try {
      await this.sinhVienService.add(sv);
      this.svForm.resetForm('#create_box');
      this.toastr.success('Thêm sinh viên thành công', 'Thông báo !');
    } catch {
      this.toastr.error('Thông tin bạn cung cấp không hợp lệ.', 'Thông báo !');
    }
  }

  onShowFormDrag() {
    let drag = this.elementRef.nativeElement.querySelector('#drag-file');
    let dragBox = this.elementRef.nativeElement.querySelector('#drag-file_box');

    drag.classList.add('active');
    dragBox.classList.add('active');
    document.documentElement.classList.add('no-scroll');
  }

  resetLineActive() {
    this.DSSVComponent.lineSV = new SinhVien();
    this.elementRef.nativeElement
      .querySelector('.table tr.br-line-dblclick')
      .classList.remove('br-line-dblclick');
  }

  async updateSinhVien() {
    let update = this.elementRef.nativeElement.querySelector('#update');
    let updateBox = this.elementRef.nativeElement.querySelector('#update_box');

    if (this.svUpdateForm.valid) {
      if (
        JSON.stringify(this.svOldForm) ===
        JSON.stringify(this.svForm.form.value)
      ) {
        this.toastr.warning(
          'Thông tin bạn cung cấp không thay đổi kể từ lần cuối cập nhập.',
          'Thông báo !'
        );
      } else {
        const sinhVien = new SinhVien();
        sinhVien.init(
          this.svUpdateForm.value['maSv'],
          this.svUpdateForm.value['tenSv'],
          this.svUpdateForm.value['ngaySinh'],
          this.svUpdateForm.value['gioiTinh'],
          this.svUpdateForm.value['lop'],
          this.svUpdateForm.value['sdt'],
          this.svUpdateForm.value['email'],
          this.svUpdateForm.value['maCn']
        );

        try {
          await this.sinhVienService.update(sinhVien);
          update.classList.remove('active');
          updateBox.classList.remove('active');
          document.documentElement.classList.remove('no-scroll');
          this.websocketService.sendForSinhVien(true);
          this.resetLineActive();
          this.toastr.success(
            'Cập nhập thông tin sinh viên thành công',
            'Thông báo !'
          );
        } catch (error) {
          this.toastr.error(
            'Thông tin bạn cung cấp không hợp lệ.',
            'Thông báo !'
          );
        }
      }
    } else {
      this.svForm.validate('#update_box');
    }

    this.DSSVComponent.lineSV = new SinhVien();
  }

  getSinhVienByMaCN(event: any) {
    const maCn = event.target.value;
    if (maCn == '') {
      this.DSSVComponent.getAllSinhVien();
    } else {
      this.DSSVComponent.getSinhVienByMaCN(maCn);
    }
  }
}
