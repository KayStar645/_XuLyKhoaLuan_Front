import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { thongBaoService } from 'src/app/services/thongBao.service';
import { Form, getParentElement, Option } from 'src/assets/utils';
import { MinistryDanhsachthongbaoComponent } from './ministry-danhsachthongbao/ministry-danhsachthongbao.component';
import { ThongBao } from '../../models/ThongBao.model';

@Component({
  selector: 'app-ministry-thongbao',
  templateUrl: './ministry-thongbao.component.html',
  styleUrls: ['./ministry-thongbao.component.scss'],
})
export class MinistryThongbaoComponent implements OnInit {
  @ViewChild(MinistryDanhsachthongbaoComponent)
  protected DSTBComponent!: MinistryDanhsachthongbaoComponent;
  searchName = '';
  isSelectedTB: boolean = false;

  tbAddForm: any;
  tbUpdateForm: any;
  dtOldForm: any;

  tbForm = new Form({
    maTb: ['', Validators.required],
    tenTb: ['', Validators.required],
    moTa: ['', Validators.email],
    noiDung: [''],
    hinhAnh: ['', Validators.required],
    fileTb: [''],
    maKhoa: ['', Validators.required],
  });

  constructor(
    private titleService: Title,
    private elementRef: ElementRef,
    private thongBaoService: thongBaoService,
    private toastr: ToastrService
  ) {
    this.tbAddForm = this.tbForm.form;
    this.tbUpdateForm = this.tbForm.form;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Danh sách thông báo');
  }

  setIsSelectedTB(event: any) {
    this.isSelectedTB = event;
  }

  onShowFormAdd() {
    let createBox = this.elementRef.nativeElement.querySelector('#create_box');
    let create = this.elementRef.nativeElement.querySelector('#create');

    createBox.classList.add('active');
    create.classList.add('active');
    this.tbForm.resetForm('#create_box');
  }

  onShowFormUpdate() {
    let updateBox = this.elementRef.nativeElement.querySelector('#update_box');
    let update = this.elementRef.nativeElement.querySelector('#update');

    if (Object.entries(this.DSTBComponent.lineTB).length > 0) {
      this.tbForm.form.setValue({
        ...this.DSTBComponent.lineTB,
      });

      updateBox.classList.add('active');
      update.classList.add('active');
      this.dtOldForm = this.tbForm.form.value;
    } else {
      this.toastr.warning(
        'Vui lòng chọn đề tài để cập nhập thông tin',
        'Thông báo !'
      );
    }
  }

  handleToggleAdd() {
    let createBox = this.elementRef.nativeElement.querySelector('#create_box');
    let create = this.elementRef.nativeElement.querySelector('#create');

    if (this.tbForm.isHaveValue()) {
      let option = new Option('#create_box');

      option.show('warning');

      option.cancel();

      option.agree(() => {
        this.tbForm.resetForm('#create_box');
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
      JSON.stringify(this.dtOldForm) !== JSON.stringify(this.tbForm.form.value)
    ) {
      let option = new Option('#update_box');

      option.show('warning');

      option.cancel();

      option.agree(() => {
        updateBox.classList.remove('active');
        update.classList.remove('active');
        this.tbForm.resetValidte('#update_box');
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

  clickDelete() {
    const _delete = this.elementRef.nativeElement.querySelector('#delete');

    if (Object.entries(this.DSTBComponent.lineTB).length > 0) {
      _delete.classList.add('active');
      let option = new Option('#delete');

      option.show('error', () => {
        _delete.classList.remove('active');
      });

      option.cancel(() => {
        _delete.classList.remove('active');
      });

      option.agree(() => {
        try {
          this.thongBaoService.delete(this.DSTBComponent.lineTB.maTb);
          this.toastr.success('Xóa đề tài thành công', 'Thông báo !');
          this.DSTBComponent.lineTB = new ThongBao();
          this.DSTBComponent.getAllThongBao();

        } catch (error) {
          this.toastr.error('Xóa đề tài thất bại', 'Thông báo !'); 
        }
        _delete.classList.remove('active');
      });
    } else if (
      Object.entries(this.DSTBComponent.lineTB).length === 0 &&
      this.DSTBComponent.selectedTB.length === 0
    ) {
      this.toastr.warning('Vui lòng chọn đề tài để xóa', 'Thông báo !');
    }

    this.DSTBComponent.selectedTB.forEach((maTB) => {
      try {
        this.thongBaoService.delete(maTB);
        this.toastr.success('Xóa đề tài thành công', 'Thông báo !');
        this.DSTBComponent.lineTB = new ThongBao();
        this.DSTBComponent.getAllThongBao();
        this.isSelectedTB = false;
      } catch (error) {
        this.toastr.error('Xóa đề tài thất bại', 'Thông báo !');
      }
    });
  }

  addSinhVien() {
    if (this.tbAddForm.valid) {
      const sinhVien = new ThongBao();
      sinhVien.init(
        this.tbAddForm.value['maTb'],
        this.tbAddForm.value['tenTb'],
        this.tbAddForm.value['moTa'],
        this.tbAddForm.value['noiDung'],
        this.tbAddForm.value['hinhAnh'],
        this.tbAddForm.value['fileTb'],
        this.tbAddForm.value['maKhoa']
      );

      try {
        this.thongBaoService.add(sinhVien);
        this.tbForm.resetForm('#create_box');
        this.toastr.success('Thêm đề tài thành công', 'Thông báo !');
        this.DSTBComponent.getAllThongBao();
      } catch (error) {
        this.toastr.error(
          'Thông tin bạn cung cấp không hợp lệ.',
          'Thông báo !'
        );
      }
    } else {
      this.tbForm.validate('#create_box');
    }
  }

  resetLineActive() {
    this.DSTBComponent.lineTB = new ThongBao();
    this.elementRef.nativeElement
      .querySelector('.table tr.br-line-hover')
      .classList.remove('br-line-hover');
  }

  async updateSinhVien() {
    let update = this.elementRef.nativeElement.querySelector('#update');
    let updateBox = this.elementRef.nativeElement.querySelector('#update_box');

    if (this.tbUpdateForm.valid) {
      if (
        JSON.stringify(this.dtOldForm) ===
        JSON.stringify(this.tbForm.form.value)
      ) {
        this.toastr.warning(
          'Thông tin bạn cung cấp không thay đổi kể từ lần cuối cập nhập.',
          'Thông báo !'
        );
      } else {
        const sinhVien = new ThongBao();
        sinhVien.init(
          this.tbUpdateForm.value['maTb'],
          this.tbUpdateForm.value['tenTb'],
          this.tbUpdateForm.value['moTa'],
          this.tbUpdateForm.value['noiDung'],
          this.tbUpdateForm.value['hinhAnh'],
          this.tbUpdateForm.value['fileTb'],
          this.tbUpdateForm.value['maKhoa']
        );
        try {
          await this.thongBaoService.update(sinhVien);
          update.classList.remove('active');
          updateBox.classList.remove('active');
          this.DSTBComponent.getAllThongBao();
          this.resetLineActive();
          this.toastr.success(
            'Cập nhập thông tin đề tài thành công',
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
      this.tbForm.validate('#update_box');
    }

    this.DSTBComponent.lineTB = new ThongBao();
  }

  getSinhVienByMaCN(event: any) {
    // const maCn = event.target.value;
    // if (maCn == '') {
    //   this.DSTBComponent.getAllThongBao();
    // } else {
    //   this.DSTBComponent.getSinhVienByMaCN(maCn);
    // }
  }

  sortThongBao(event: any) {
    const sort = event.target.value;
    this.DSTBComponent.sortThongBao(sort);
  }
}
