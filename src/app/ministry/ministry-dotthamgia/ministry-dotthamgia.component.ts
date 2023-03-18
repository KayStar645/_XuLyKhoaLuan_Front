import { MinistryDanhsachthamgiaComponent } from './ministry-danhsachthamgia/ministry-danhsachthamgia.component';
import { Nhom } from 'src/app/models/Nhom.model';
import { nhomService } from 'src/app/services/nhom.service';
import { ThamGia } from 'src/app/models/ThamGia.model';
import { thamGiaService } from './../../services/thamGia.service';
import { dotDkService } from './../../services/dotDk.service';
import { DotDk } from './../../models/DotDk.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ChuyenNganh } from 'src/app/models/ChuyenNganh.model';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { sinhVienService } from 'src/app/services/sinhVien.service';
import { userService } from 'src/app/services/user.service';
import { Form, getParentElement, Option } from 'src/assets/utils';
import * as XLSX from 'xlsx';
import { User } from 'src/app/models/User.model';

@Component({
  selector: 'app-ministry-dotthamgia',
  templateUrl: './ministry-dotthamgia.component.html',
  // styleUrls: ['./ministry-dotthamgia.component.scss']
})
export class MinistryDotthamgiaComponent implements OnInit {
  @ViewChild(MinistryDanhsachthamgiaComponent)
  protected DSTGComponent!: MinistryDanhsachthamgiaComponent;
  listChuyenNganh: ChuyenNganh[] = [];
  listDotDk: DotDk[] = [];
  searchName = '';
  selectedChuyenNganh!: string;
  isSelectedSV: boolean = false;
  // selectedDotDk!: string;

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
    private userService: userService,
    private dotDkService: dotDkService,
    private thamGiaService: thamGiaService,
    private nhomService: nhomService,
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
    this.listDotDk = await this.dotDkService.getAll();
    if(this.listDotDk.length > 0) {
      this.namHoc = this.listDotDk[0].namHoc;
      this.dot = this.listDotDk[0].dot;
    }
  }

  setIsSelectedSv(event: any) {
    this.isSelectedSV = event;
  }

  onShowFormAdd() {
    let createBox = this.elementRef.nativeElement.querySelector('#create_box');
    let create = this.elementRef.nativeElement.querySelector('#create');

    createBox.classList.add('active');
    create.classList.add('active');
    this.svForm.resetForm('#create_box');
  }

  onShowFormUpdate() {
    let updateBox = this.elementRef.nativeElement.querySelector('#update_box');
    let update = this.elementRef.nativeElement.querySelector('#update');

    if (Object.entries(this.DSTGComponent.lineSV).length > 0) {
      this.svForm.form.setValue({
        ...this.DSTGComponent.lineSV,
        ngaySinh: this.DSTGComponent.lineSV.ngaySinh.substring(0, 10),
      });

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
      JSON.stringify(this.svOldForm) !== JSON.stringify(this.svForm.form.value)
    ) {
      let option = new Option('#update_box');

      option.show('warning');

      option.cancel();

      option.agree(() => {
        updateBox.classList.remove('active');
        update.classList.remove('active');
        this.svForm.resetValidte('#update_box');
      });

      option.save(() => {
        this.updateSinhVien();
        update.classList.remove('active');
        updateBox.classList.remove('active');
      });
    } else {
      update.classList.remove('active');
      updateBox.classList.remove('active');
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

  async clickDelete() {
    const _delete = this.elementRef.nativeElement.querySelector('#delete');

    if (Object.entries(this.DSTGComponent.lineSV).length > 0) {
      _delete.classList.add('active');
      let option = new Option('#delete');

      option.show('error', () => {
        _delete.classList.remove('active');
      });

      option.cancel(() => {
        _delete.classList.remove('active');
      });

      option.agree(() => {
        // Xóa tham gia trước -- Chưa làm
        try {
          const result = this.sinhVienService.delete(this.DSTGComponent.lineSV.maSv);
          this.toastr.success('Xóa sinh viên thành công', 'Thông báo !');
          this.DSTGComponent.lineSV = new SinhVien();
          this.DSTGComponent.getAllSinhVien();
        } catch (error) {
          this.toastr.error(
            'Xóa sinh viên thất bại, vui lòng cập nhập ngày nghỉ thay vì xóa',
            'Thông báo !'
          );
        }
        _delete.classList.remove('active');
      });
    } else if (
      Object.entries(this.DSTGComponent.lineSV).length === 0 &&
      this.DSTGComponent.selectedSV.length === 0
    ) {
      this.toastr.warning('Vui lòng chọn sinh viên để xóa', 'Thông báo !');
    }

    this.DSTGComponent.selectedSV.forEach((maSV) => {
      try {
        this.sinhVienService.delete(maSV);
        this.userService.delete(maSV);
        this.toastr.success('Xóa sinh viên thành công', 'Thông báo !');
        this.DSTGComponent.lineSV = new SinhVien();
        this.DSTGComponent.getAllSinhVien();
        this.isSelectedSV = false;
      } catch (error) {
        this.toastr.error('Xóa sinh viên thất bại', 'Thông báo !'); 
      }
    });
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
      
    } else {
      this.svForm.validate('#create_box');
    }
  }

  async f_AddSinhVien(sv: SinhVien) {
    // Kiểm tra sinh viên đã tồn tại chưa 
    const flag = await this.sinhVienService.getById(sv.maSv);
    const nhom = new Nhom();
    nhom.init(sv.maSv + this.namHoc + this.dot, sv.tenSv, sv.maSv);

    const thamgia = new ThamGia();
    thamgia.init(sv.maSv, this.namHoc, this.dot, sv.maSv + this.namHoc + this.dot, 0);

    if(flag != null) {
      // Add: Tạo nhóm cho sinh viên và đưa sinh viên vào tham gia đợt đăng ký này
      this.f_CreateGroup_ThamGia(nhom, thamgia);

      this.toastr.success('Thêm sinh viên vào đợt đợt đăng ký thành công', 'Thông báo !');
      this.DSTGComponent.getAllSinhVienByDotdk();
    }
    else {
      try {
        await this.sinhVienService.add(sv);
        this.svForm.resetForm('#create_box');
          // Add tai khoan
          await this.userService.addStudent(new User(sv.maSv, sv.maSv));
          // Add: Đưa sinh viên vào đợt tham gia và tạo nhóm lần đầu
          this.f_CreateGroup_ThamGia(nhom, thamgia);
  
          this.toastr.success('Thêm sinh viên thành công', 'Thông báo !');
          this.DSTGComponent.getAllSinhVienByDotdk();
      }
      catch {
        this.toastr.error(
          'Thông tin bạn cung cấp không hợp lệ.',
          'Thông báo !'
        );
      }
    }
  }

  async f_CreateGroup_ThamGia(nhom: Nhom, thamgia: ThamGia) {
    try {
      await this.nhomService.add(nhom);
      await this.thamGiaService.add(thamgia);
    } 
    catch (error) {
      console.log(error);
    }
  }

  resetLineActive() {
    this.DSTGComponent.lineSV = new SinhVien();
    this.elementRef.nativeElement
      .querySelector('.table tr.br-line-dblclick')
      .classList.remove('br-line-dblclick');
  }

  updateSinhVien() {
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
          const result = this.sinhVienService.update(sinhVien);
          update.classList.remove('active');
          updateBox.classList.remove('active');
          this.DSTGComponent.getAllSinhVien();
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

    this.DSTGComponent.lineSV = new SinhVien();
  }

  getSinhVienByMaCN(event: any) {
    const maCn = event.target.value;
    if (maCn == '') {
      this.DSTGComponent.getAllSinhVienByDotdk();
    } else {
      this.DSTGComponent.getSinhVienByMaCN(maCn);
    }
  }

  getSinhVienByDotDk(event: any) {
    const dotdk = event.target.value;
    if (dotdk == '') {
      this.DSTGComponent.getAllSinhVienByDotdk();
    } else {
      this.namHoc = dotdk.slice(0, dotdk.length - 1);
      this.dot = dotdk.slice(dotdk.length - 1);
      console.log(this.namHoc);
      console.log(this.dot);
      this.DSTGComponent.getSinhVienByDotDk(this.namHoc, this.dot);
    }
  }
}
