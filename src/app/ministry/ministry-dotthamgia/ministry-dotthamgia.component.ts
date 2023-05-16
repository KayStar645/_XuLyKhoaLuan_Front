import { MinistryDanhsachthamgiaComponent } from './ministry-danhsachthamgia/ministry-danhsachthamgia.component';
import { Nhom } from 'src/app/models/Nhom.model';
import { nhomService } from 'src/app/services/nhom.service';
import { ThamGia } from 'src/app/models/ThamGia.model';
import { thamGiaService } from './../../services/thamGia.service';
import { dotDkService } from './../../services/dotDk.service';
import { DotDk } from './../../models/DotDk.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { ChuyenNganh } from 'src/app/models/ChuyenNganh.model';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { sinhVienService } from 'src/app/services/sinhVien.service';
import { getParentElement, Option } from 'src/assets/utils';
import { WebsocketService } from 'src/app/services/Websocket.service';

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
  isSelectedTG: boolean = false;
  selectedSV: any[] = [];

  namHoc!: string;
  dot!: number;

  constructor(
    private titleService: Title,
    private elementRef: ElementRef,
    private chuyenNganhService: chuyenNganhService,
    private sinhVienService: sinhVienService,
    private toastr: ToastrService,
    private dotDkService: dotDkService,
    private thamGiaService: thamGiaService,
    private nhomService: nhomService,
    private websocketService: WebsocketService
  ) {}

  async ngOnInit() {
    this.titleService.setTitle('Danh sách sinh viên');
    this.listChuyenNganh = await this.chuyenNganhService.getAll();
    this.listDotDk = await this.dotDkService.getAll();

    if (this.listChuyenNganh.length > 0) {
      this.selectedChuyenNganh = this.listChuyenNganh[0].maCn;
    }

    if (this.listDotDk.length > 0) {
      this.namHoc = this.listDotDk[0].namHoc;
      this.dot = this.listDotDk[0].dot;
    }

    this.listSinhVien = await this.sinhVienService.getByDotDk(
      this.namHoc,
      this.dot,
      false
    );

    this.websocketService.startConnection();
  }

  async resetList() {
    this.listDotDk = await this.dotDkService.getAll();
    this.listSinhVien = await this.sinhVienService.getByDotDk(
      this.namHoc,
      this.dot,
      false
    );
  }

  toggleAddAll(event: any) {
    const element = event.target;
    const parent: any = getParentElement(element, '.table');
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

  // onShowFormUpdate() {
  //   let updateBox = this.elementRef.nativeElement.querySelector('#update_box');
  //   let update = this.elementRef.nativeElement.querySelector('#update');

  //   updateBox.classList.add('active');
  //   update.classList.add('active');
  // }

  handleToggleAdd() {
    let createBox = this.elementRef.nativeElement.querySelector('#create_box');
    let create = this.elementRef.nativeElement.querySelector('#create');

    createBox.classList.remove('active');
    create.classList.remove('active');
  }

  async clickDelete() {
    if (Object.entries(this.DSTGComponent.lineTG).length > 0) {
      let option = new Option('#delete');

      option.show('error', () => {});

      option.cancel(() => {});

      option.agree(async () => {
        try {
          await this.thamGiaService.delete(
            this.DSTGComponent.lineTG.maSv,
            this.DSTGComponent.lineTG.namHoc,
            this.DSTGComponent.lineTG.dot
          );
          this.websocketService.sendForThamGia(true);

          this.toastr.success('Xóa sinh viên thành công', 'Thông báo !');
          this.DSTGComponent.lineTG = new ThamGia();
        } catch (error) {
          this.toastr.error(
            'Xóa sinh viên thất bại, vui lòng cập nhập ngày nghỉ thay vì xóa',
            'Thông báo !'
          );
        }
      });
    } else if (
      Object.entries(this.DSTGComponent.lineTG).length === 0 &&
      this.DSTGComponent.selectedTG.length === 0
    ) {
      this.toastr.warning('Vui lòng chọn sinh viên để xóa', 'Thông báo !');
    }

    this.DSTGComponent.selectedTG.forEach((item) => {
      try {
        this.thamGiaService.delete(item.maSv, item.namHoc, item.dot);
        this.toastr.success('Xóa sinh viên thành công', 'Thông báo !');
        this.DSTGComponent.getAllThamgiaByDotdk();
        this.isSelectedTG = false;
      } catch (error) {
        this.toastr.error('Xóa sinh viên thất bại', 'Thông báo !');
      }
    });
    this.DSTGComponent.selectedTG = [];
  }

  async addThamgia() {
    for (var maSv of this.selectedSV) {
      var sv = await this.sinhVienService.getById(maSv);
      this.f_AddThamgia(sv);
    }
    this.resetList();
  }

  async f_AddThamgia(sv: SinhVien) {
    try {
      // Tạo nhóm cho sinh viên
      const nhom = new Nhom();
      const maNhom = sv.maSv + this.namHoc + this.dot;
      nhom.init(maNhom, sv.tenSv);
      await this.nhomService.add(nhom);

      // Đưa sinh viên vào tham gia đợt đăng ký này
      const thamgia = new ThamGia();
      thamgia.init(sv.maSv, this.namHoc, this.dot, maNhom, 0, true);
      await this.thamGiaService.add(thamgia);

      this.websocketService.sendForThamGia(true);

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
    this.DSTGComponent.lineTG = new ThamGia();
    this.elementRef.nativeElement
      .querySelector('.table tr.br-line-dblclick')
      .classList.remove('br-line-dblclick');
  }

  // updateSinhVien() {
  //   let update = this.elementRef.nativeElement.querySelector('#update');
  //   let updateBox = this.elementRef.nativeElement.querySelector('#update_box');
  //   this.DSTGComponent.lineTG = new ThamGia();
  // }

  getThamgiaByMaCN(event: any) {
    const maCn = event.target.value;
    this.DSTGComponent.getThamgiaByMaCN(maCn);
  }

  getTenCnById(maCn: string) {
    return this.DSTGComponent.getTenCNById(maCn);
  }

async getThamgiaByDotDk(event: any) {
    const dotdk = event.target.value;
    this.DSTGComponent.getThamgiaByDotDk(dotdk);
  }

  async getSinhvienByMaCN(event: any) {
    const maCn = event.target.value;
    this.DSTGComponent.getThamgiaByMaCN(maCn);
  }

  async getSinhvienByMaCNToListSV(event: any) {}

  async getSinhvienByNotDotDk(event: any) {
    const dotdk = event.target.value;
    this.namHoc = dotdk.slice(0, dotdk.length - 1);
    this.dot = dotdk.slice(dotdk.length - 1);
    this.listSinhVien = await this.sinhVienService.getByDotDk(
      this.namHoc,
      this.dot,
      false
    );
  }
}
