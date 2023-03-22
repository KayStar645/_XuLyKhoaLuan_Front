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

@Component({
  selector: 'app-ministry-dotthamgia',
  styleUrls: ['./ministry-dotthamgia.component.scss'],
  templateUrl: './ministry-dotthamgia.component.html',
})
export class MinistryDotthamgiaComponent implements OnInit {
  @ViewChild(MinistryDanhsachthamgiaComponent)
  protected DSTGComponent!: MinistryDanhsachthamgiaComponent;
  listChuyenNganh: ChuyenNganh[] = [];

  listSinhVien: SinhVien[] = [];

  listDotDk: DotDk[] = [];
  searchName = '';
  selectedChuyenNganh!: string;
  isSelectedSV: boolean = false;
  selectedSV: string[] = [];

  namHoc!: string;
  dot!: number;

  constructor(
    private titleService: Title,
    private elementRef: ElementRef,
    private chuyenNganhService: chuyenNganhService,
    private sinhVienService: sinhVienService,
    private toastr: ToastrService,
    private userService: userService,
    private dotDkService: dotDkService,
    private thamGiaService: thamGiaService,
    private nhomService: nhomService
  ) { }

  async ngOnInit() {
    this.titleService.setTitle('Danh sách sinh viên');
    this.listChuyenNganh = await this.chuyenNganhService.getAll();
    if (this.listChuyenNganh.length > 0) {
      this.selectedChuyenNganh = this.listChuyenNganh[0].maCn;
    }
    this.listDotDk = await this.dotDkService.getAll();
    if (this.listDotDk.length > 0) {
      this.namHoc = this.listDotDk[0].namHoc;
      this.dot = this.listDotDk[0].dot;
    }


    this.listSinhVien = await this.sinhVienService.getByDotDk(this.namHoc, this.dot, false);
  }

  toggleAddAll(event: any) {
    const element = event.target;
    const parent = getParentElement(element, '.table');
    const child = parent.querySelectorAll('.add-btn');

    if (!element.classList.contains('active')) {
      this.selectedSV = [];
      child.forEach((item: any) => {
        const parent = getParentElement(item, '.br-line');
        const firstElememt = parent.firstChild;

        this.selectedSV.push(firstElememt.innerHTML);
        item.firstChild.classList.remove('none');
      });
      element.classList.add('active');  
    } else {
      this.selectedSV = [];
      child.forEach((item: any) => {
        if (!item.firstChild.classList.contains('none')) {
          item.firstChild.classList.add('none');
        }
      });
      element.classList.remove('active');
    }
  }

  toggleAdd(event: any) {
    try {
      const element = event.target;
      const parent = getParentElement(element, '.br-line');
      const firstElememt = parent.firstChild;
      
      // Câu này để văng lỗi
      element.firstChild.classList.contains('none');
      
      this.selectedSV.push(firstElememt.innerHTML);

      element.firstChild.classList.remove('none');
    } catch {
      const element = getParentElement(event.target, '.add-btn');
      const parent = getParentElement(element, '.br-line');
      const firstElememt = parent.firstChild;
      
      let index = this.selectedSV.findIndex(
        (t) => t === firstElememt.innerHTML
      );
      this.selectedSV.splice(index, 1);

      element.firstChild.classList.add('none');
    }
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


      updateBox.classList.add('active');
      update.classList.add('active');
  }

  handleToggleAdd() {
    let createBox = this.elementRef.nativeElement.querySelector('#create_box');
    let create = this.elementRef.nativeElement.querySelector('#create');

    createBox.classList.remove('active');
    create.classList.remove('active');
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
          const result = this.sinhVienService.delete(
            this.DSTGComponent.lineSV.maSv
          );
          this.toastr.success('Xóa sinh viên thành công', 'Thông báo !');
          this.DSTGComponent.lineSV = new SinhVien();
          // this.DSTGComponent.getAllSinhVien();
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
        // this.DSTGComponent.getAllSinhVien();
        this.isSelectedSV = false;
      } catch (error) {
        this.toastr.error('Xóa sinh viên thất bại', 'Thông báo !');
      }
    });
  }

  async addThamgia() {
    for (var maSv of this.selectedSV) {
      var sv = await this.sinhVienService.getById(maSv);
      console.log(maSv);
      console.log(sv);
      this.f_AddThamgia(sv);
    }
    this.listSinhVien = await this.sinhVienService.getByDotDk(this.namHoc, this.dot, false);

  }

  async f_AddThamgia(sv: SinhVien) {
    try {
      const nhom = new Nhom();
      const maNhom = sv.maSv + this.namHoc + this.dot;
      nhom.init(maNhom, sv.tenSv, sv.maSv);
  
      const thamgia = new ThamGia();
      thamgia.init(sv.maSv, this.namHoc, this.dot, maNhom, 0);
  
      // Add: Tạo nhóm cho sinh viên và đưa sinh viên vào tham gia đợt đăng ký này
      await this.nhomService.add(nhom);
      await this.thamGiaService.add(thamgia);
  
      this.toastr.success(
        'Thêm sinh viên vào đợt đợt đăng ký thành công',
        'Thông báo !'
      ); 
    } catch (error) {
      this.toastr.error(
        'Thêm sinh viên vào đợt đợt đăng ký thất bại',
        'Thông báo !'
      );
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
    this.DSTGComponent.lineSV = new SinhVien();
  }

  getThamgiaByMaCN(event: any) {
    const maCn = event.target.value;
    if (maCn == '') {
      this.DSTGComponent.getAllThamgiaByDotdk();
    } else {
      this.DSTGComponent.getThamgiaByMaCN(maCn);
    }
  }

  getTenCnById(maCn: string) {
    return this.DSTGComponent.getTenCNById(maCn);
  }

  getThamgiaByDotDk(event: any) {
    const dotdk = event.target.value;
    if (dotdk == '') {
      this.DSTGComponent.getAllThamgiaByDotdk();
    } else {
      this.namHoc = dotdk.slice(0, dotdk.length - 1);
      this.dot = dotdk.slice(dotdk.length - 1);
      this.DSTGComponent.getThamgiaByDotDk(this.namHoc, this.dot);
    }
  }

  async getSinhvienByMaCN(event: any) {
    const maCn = event.target.value;
    if(maCn == '') {
      this.listSinhVien = await this.sinhVienService.getByDotDk(this.namHoc, this.dot, false);
    }
    else {

      this.listSinhVien = await this.sinhVienService.getByMaCn(maCn);
    }
  }

  async getSinhvienByMaCNToListSV(event: any) {
    
  }

  async getSinhvienByNotDotDk(event: any) {
    const dotdk = event.target.value;
    this.namHoc = dotdk.slice(0, dotdk.length - 1);
    this.dot = dotdk.slice(dotdk.length - 1);
    this.listSinhVien = await this.sinhVienService.getByDotDk(this.namHoc, this.dot, false);
  }
}
