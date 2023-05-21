import { shareService } from 'src/app/services/share.service';
import { boMonService } from 'src/app/services/boMon.service';
import { GiangVien } from 'src/app/models/GiangVien.model';
import { BoMon } from '../../models/BoMon.model';
import { giangVienService } from '../../services/giangVien.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Validators } from '@angular/forms';
import { Form, getParentElement, Option } from 'src/assets/utils';
import * as XLSX from 'xlsx';
import { ToastrService } from 'ngx-toastr';
import { MinistryDanhsachgiangvienComponent } from './ministry-danhsachgiangvien/ministry-danhsachgiangvien.component';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { DeTai } from 'src/app/models/DeTai.model';
import { compareAsc, formatDistance, formatDistanceStrict } from 'date-fns';

@Component({
  selector: 'app-ministry-giangvien',
  templateUrl: './ministry-giangvien.component.html',
  // styleUrls: ['./ministry-giangvien.component.scss'],
})
export class MinistryGiangvienComponent implements OnInit {
  @ViewChild(MinistryDanhsachgiangvienComponent)
  private DSGVComponent!: MinistryDanhsachgiangvienComponent;
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
    ngaySinh: [''],
    ngayNhanViec: [''],
    gioiTinh: ['', Validators.required],
    hocHam: [''],
    sdt: [''],
    hocVi: [''],
    ngayNghi: [''],
  });

  constructor(
    private titleService: Title,
    private elementRef: ElementRef,
    private boMonService: boMonService,
    private giangVienService: giangVienService,
    private toastr: ToastrService,
    private websocketService: WebsocketService,
    private shareService: shareService
  ) {
    this.gvAddForm = this.gvForm.form;
    this.gvUpdateForm = this.gvForm.form;
  }

  async ngOnInit() {
    this.titleService.setTitle('Danh sách giảng viên');
    this.listBoMon = await this.boMonService.getAll();
    if (this.listBoMon.length > 0) {
      this.selectedBomon = this.listBoMon[0].maBm;
    }

    this.websocketService.startConnection();
  }

  onShowFormAdd() {
    document.documentElement.classList.add('no-scroll');
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
        ngayNhanViec: '',
        ngaySinh: '',
        ngayNghi: '',
      });

      updateBox.classList.add('active');
      update.classList.add('active');
      this.gvOldForm = this.gvForm.form.value;
      document.documentElement.classList.add('no-scroll');
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

      option.show('warning', () => {
        create.classList.remove('active');
      });

      option.cancel(() => {
        create.classList.remove('active');
      });

      option.agree(() => {
        this.gvForm.resetForm('#create_box');
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
    document.documentElement.classList.add('no-scroll');
    let updateBox = this.elementRef.nativeElement.querySelector('#update_box');
    let update = this.elementRef.nativeElement.querySelector('#update');

    if (
      JSON.stringify(this.gvOldForm) !== JSON.stringify(this.gvForm.form.value)
    ) {
      let option = new Option('#update_box');

      option.show('warning', () => {
        update.classList.remove('active');
      });

      option.cancel(() => {
        update.classList.remove('active');
      });

      option.agree(() => {
        update.classList.remove('active');
        this.gvForm.resetValidate('#update_box');
        document.documentElement.classList.remove('no-scroll');
      });

      option.save(() => {
        this.updateGiangVien();
        update.classList.remove('active');
        document.documentElement.classList.remove('no-scroll');
      });
    } else {
      update.classList.remove('active');
      updateBox.classList.remove('active');
      document.documentElement.classList.remove('no-scroll');
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
      const datas = excelData.slice(1, excelData.length);
      this.giangVienFile = {
        name: file.name,
        size: (file.size / 1024).toFixed(2) + 'MB',
        data: datas,
      };
    };
  }

  async onReadFile() {
    if (this.giangVienFile.data.length > 0) {
      const datas = this.giangVienFile.data;

      for (let data of datas) {
        if (data[1] == '') {
          continue;
        }
        let gv = new GiangVien();
        var bomMon = await this.boMonService.getBomonByName(
          this.shareService.removeSpace(data[7])
        );
        gv.init(
          data[1] ? this.shareService.removeSpace(data[1]) : '',
          data[2] ? this.shareService.removeSpace(data[2]) : '',
          '',
          data[3] ? this.shareService.removeSpace(data[3]) : '',
          data[4] ? this.shareService.removeSpace(data[4]) : '',
          data[5] ? this.shareService.removeSpace(data[5]) : '',
          '',
          data[6] ? this.shareService.removeSpace(data[6]) : '',
          '',
          '',
          bomMon.maBm
        );
        this.f_AddGiangVien(gv);
      }

      this.websocketService.sendForGiangVien(true);
    }
  }

  onNgaySinhInput(event: any) {
    let formValue: any = this.gvForm.form.value;
    let ngaySinh: any = this.gvForm.form.get('ngaySinh');
    let value = event.target.value;
    let date1 = new Date(value);
    let date2 = formValue.ngayNhanViec
      ? new Date(formValue.ngayNhanViec)
      : new Date();
    let isSmaller = compareAsc(date1, date2) === -1 ? true : false;

    if (isSmaller) {
      let yearBetween = parseInt(
        formatDistanceStrict(date1, date2, { unit: 'year' }).split(' ')[0]
      );

      ngaySinh.setValidators([
        this.shareService.customValidator(
          'dateBirth18',
          / /,
          yearBetween >= 18 ? true : false
        ),
        Validators.required,
      ]);
      ngaySinh.updateValueAndValidity();
      this.gvForm.validateSpecificControl(['ngaySinh']);
    } else {
      ngaySinh.setErrors({
        dateBirth18: 'Ngày sinh phải lớn hơn ngày hiện tại',
      });
      this.gvForm.validateSpecificControl(['ngaySinh']);
    }
  }

  onSelect() {
    let input = this.elementRef.nativeElement.querySelector(
      '#drag-file_box input[type=file]'
    );

    input.click();
  }

  onShowFormDrag() {
    let drag = this.elementRef.nativeElement.querySelector('#drag-file');
    let dragBox = this.elementRef.nativeElement.querySelector('#drag-file_box');

    drag.classList.add('active');
    dragBox.classList.add('active');
    document.documentElement.classList.add('no-scroll');
  }

  onCloseDrag(event: any) {
    let dragBox = this.elementRef.nativeElement.querySelector('#drag-file_box');

    event.target.classList.remove('active');
    document.documentElement.classList.remove('no-scroll');
    dragBox.classList.remove('active');
  }

  clickDelete() {
    if (Object.entries(this.DSGVComponent.lineGV).length > 0) {
      let option = new Option('#delete');

      option.show('error', () => {});

      option.cancel(() => {});

      option.agree(() => {
        this.f_DeleteGiangVien(this.DSGVComponent.lineGV.maGv);
      });
    } else {
      this.toastr.warning('Vui lòng chọn giảng viên để xóa', 'Thông báo !');
    }
    this.websocketService.sendForGiangVien(true);
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

      this.f_AddGiangVien(giangVien);
    } else {
      this.gvForm.validate('#create_box');
    }
  }

  resetLineActive() {
    if (document.querySelector('.table tr.br-line-hover')) {
      this.DSGVComponent.lineGV = new GiangVien();
      document
        .querySelector('.table tr.br-line-hover')
        ?.classList.remove('br-line-hover');
    }
  }

  async updateGiangVien() {
    let update = this.elementRef.nativeElement.querySelector('#update');
    let updateBox = this.elementRef.nativeElement.querySelector('#update_box');

    if (this.gvUpdateForm.valid) {
      if (
        JSON.stringify(this.gvOldForm) ===
        JSON.stringify(this.gvForm.form.value)
      ) {
        this.toastr.warning(
          'Thông tin bạn cung cấp không thay đổi kể từ lần cuối cập nhập.',
          'Thông báo !'
        );
      } else {
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
          this.gvUpdateForm.value['ngayNghi']
            ? this.gvUpdateForm.value['ngayNghi']
            : '',
          this.gvUpdateForm.value['maBm']
        );

        try {
          await this.giangVienService.update(giangVien);
          update.classList.remove('active');
          updateBox.classList.remove('active');
          this.resetLineActive();
          this.toastr.success(
            'Cập nhập thông tin giảng viên viên thành công',
            'Thông báo !'
          );
          this.websocketService.sendForGiangVien(true);
        } catch {
          this.toastr.error(
            'Thông tin bạn cung cấp không hợp lệ.',
            'Thông báo !'
          );
        }
      }
    } else {
      this.gvForm.validate('#update_box');
    }
  }

  getGiangVienByMaBM(event: any) {
    const maBM = event.target.value;
    this.DSGVComponent.getGiangVienByMaBM(maBM);
  }

  async f_AddGiangVien(gv: GiangVien) {
    try {
      await this.giangVienService.add(gv);
      this.gvForm.resetForm('#create_box');
      this.websocketService.sendForGiangVien(true);
      this.toastr.success('Thêm giảng viên thành công', 'Thông báo !');
    } catch {
      this.toastr.error('Thông tin bạn cung cấp không hợp lệ.', 'Thông báo !');
    }
  }

  async f_DeleteGiangVien(maGV: string) {
    try {
      await this.giangVienService.delete(this.DSGVComponent.lineGV.maGv);

      this.toastr.success('Xóa giảng viên thành công', 'Thông báo !');
      this.DSGVComponent.lineGV = new GiangVien();
    } catch {
      this.toastr.error(
        'Xóa giảng viên thất bại, vui lòng cập nhập ngày nghỉ thay vì xóa',
        'Thông báo !'
      );
    }
  }
}
