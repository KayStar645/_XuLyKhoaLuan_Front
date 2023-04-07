import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeTai } from 'src/app/models/DeTai.model';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { deTaiService } from 'src/app/services/deTai.service';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { Form, Option, getParentElement } from 'src/assets/utils';
import { MinistryDanhsachdetaiComponent } from '../ministry-danhsachdetai/ministry-danhsachdetai.component';
import { giangVienService } from 'src/app/services/giangVien.service';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { RaDe } from 'src/app/models/RaDe.model';
import { DeTai_ChuyenNganh } from 'src/app/models/DeTai_ChuyenNganh.model';
import { deTai_chuyenNganhService } from 'src/app/services/deTai_chuyenNganh.service';
import { raDeService } from 'src/app/services/raDe.service';
import { duyetDtService } from 'src/app/services/duyetDt.service';
import { DuyetDt } from 'src/app/models/DuyetDt.model';
import { format, formatDistanceToNowStrict } from 'date-fns';
import { vi } from 'date-fns/locale';
import { shareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-ministry-chitietdetai',
  templateUrl: './ministry-chitietdetai.component.html',
  styleUrls: ['./ministry-chitietdetai.component.scss'],
})
export class MinistryChitietdetaiComponent {
  DSDTComponent!: MinistryDanhsachdetaiComponent;

  maDt: string = '';
  oldForm: any;
  deTai: DeTai = new DeTai();
  selectedCN: any[] = [];
  listSV: SinhVien[] = [];
  listDuyetDT: any[] = [];
  listDeta_Chuyennganh: DeTai_ChuyenNganh[] = [];
  listRaDe: RaDe[] = [];
  slMin: number = 1;
  slMax: number = 3;
  tenGv: string = '';

  GVInputConfig: any = {};
  CNInputConfig: any = {};

  dtForm = new Form({
    maDT: ['', Validators.required],
    tenDT: ['', Validators.required],
    tomTat: ['', Validators.required],
    slMin: ['', Validators.required],
    slMax: ['', Validators.required],
    trangThai: [false, Validators.required],
    tenGv: ['', Validators.required],
    maGv: ['', Validators.required],
    nhanXet: [''],
  });

  quillConfig: any = {
    toolbar: {
      container: [
        ['bold', 'italic', 'underline'],
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }],
        ['link'],
        ['clean'],
      ],
    },
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private giangVienService: giangVienService,
    private chuyenNganhService: chuyenNganhService,
    private deTaiChuyenNganhService: deTai_chuyenNganhService,
    private duyetDTService: duyetDtService,
    private deTaiService: deTaiService,
    private raDeService: raDeService,
    private toastr: ToastrService,
    private websocketService: WebsocketService
  ) {}

  async ngOnInit() {
    await this.raDeService.getAll().then((data) => {
      this.listRaDe = data;
    });

    await this.deTaiChuyenNganhService.getAll().then((data) => {
      this.listDeta_Chuyennganh = data;
    });

    await this.giangVienService.getAll().then((data) => {
      this.GVInputConfig.data = data;
      this.GVInputConfig.keyword = 'tenGv';
    });

    await this.chuyenNganhService.getAll().then((data) => {
      this.CNInputConfig.data = data;
      this.CNInputConfig.keyword = 'tenCn';
    });

    this.route.params.subscribe((params) => {
      this.maDt = params['maDt'];
      this.setForm();
    });

    this.getComment();

    this.websocketService.startConnection();
    this.websocketService.receiveFromDuyetDT((dataChange: boolean) => {
      if (dataChange) {
        this.getComment();
      }
    });
  }

  async getComment() {
    await this.duyetDTService.getByMadt(this.maDt).then((data) => {
      this.listDuyetDT = data;

      this.listDuyetDT = this.listDuyetDT.map((t: any) => {
        return {
          ...t,
          thoiGian: formatDistanceToNowStrict(new Date(t.ngayDuyet), {
            locale: vi,
          }),
          tenGv: this.GVInputConfig.data.find((t2: any) => t2.maGv === t.maGv)
            .tenGv,
        };
      });
    });
  }

  onBlur(event: any) {
    this.dtForm.inputBlur(event);
  }

  setSlMax(event: any) {
    const currentValue = parseInt(event.target.value);
    const previousValue = parseInt(event.target.defaultValue);

    if (currentValue > previousValue) {
      this.slMax += 1;
    } else if (currentValue < previousValue) {
      this.slMax -= 1;
    }
  }

  async onUpdate() {
    let formValue: any = this.dtForm.form.value;

    if (this.dtForm.form.valid) {
      const deTai = new DeTai();
      const raDe = new RaDe();
      const deTaiChuyenNganhs: DeTai_ChuyenNganh[] = [];

      raDe.init(formValue.maGv, formValue.maDT);

      this.selectedCN.forEach((item) => {
        let deTaiChuyenNganh = new DeTai_ChuyenNganh();

        deTaiChuyenNganh.init(item.maCn, formValue.maDT);
        deTaiChuyenNganhs.push(deTaiChuyenNganh);
      });

      deTai.init(
        formValue.tenDT,
        formValue.tomTat,
        formValue.slMin,
        formValue.slMax,
        shareService.namHoc,
        shareService.dot
      );
      try {
        await this.deTaiService.update(deTai);

        deTaiChuyenNganhs.forEach(async (item) => {
          await this.deTaiChuyenNganhService.delete(item.maDt, item.maCn);
          await this.deTaiChuyenNganhService.add(item);
        });

        await this.raDeService.delete(raDe.maGv, raDe.maDt);
        await this.raDeService.add(raDe);
        this.websocketService.sendForDeTai(true);

        this.toastr.success(
          'Cập nhập thông tin đề tài thành công',
          'Thông báo !'
        );
      } catch {
        this.toastr.error('Cập nhập Đề tài thất bại', 'Thông báo !');
      }
    } else {
      this.toastr.warning('Thông tin bạn cung cấp không hợp lệ', 'Đề tài!');
      this.dtForm.validate('.dt-form');
    }
  }

  async setForm() {
    if (this.maDt) {
      await this.deTaiService.getById(this.maDt).then(async (data) => {
        let gv = this.getGvRadeByMaDT(data.maDT);

        console.log(gv);

        this.deTai = data;
        this.getTenChuyennganhByMaDT(this.deTai.maDT);

        this.dtForm.form.patchValue({
          ...this.deTai,
          maGv: gv.maGv,
          tenGv: gv.tenGv,
          trangThai: JSON.stringify(this.deTai.trangThai),
        });

        return this.deTai;
      });

      this.oldForm = this.dtForm.form.value;
    } else {
      this.dtForm.resetForm('.dt-form');

      this.dtForm.form.patchValue({
        slMin: this.slMin,
        slMax: this.slMax,
      });
    }
  }

  onOpenDropdown(event: any) {
    event.stopPropagation();
    let parent =
      getParentElement(event.target, '.selected-box') || event.target;

    parent.classList.toggle('active');
  }

  async onAddComment() {
    const formValue: any = this.dtForm.form.value;
    const value: any = formValue.nhanXet;
    if (value) {
      try {
        let duyetDt = new DuyetDt();
        duyetDt.init(
          'GV00001',
          this.maDt,
          format(new Date(), 'yyyy-MM-dd') +
            'T' +
            format(new Date(), 'HH:mm:ss'),
          value
        );

        await this.duyetDTService.add(duyetDt);
        this.websocketService.sendForDuyetDT(true);
      } catch (error) {}
    }
  }

  onSetItem(event: any) {
    event.stopPropagation();
    let element = event.target;

    if (element.classList.contains('active')) {
      let index = this.selectedCN.findIndex(
        (t) => t.maCn == element.dataset.index
      );

      element.classList.remove('active');
      this.selectedCN.splice(index, 1);
    } else {
      let index = element.dataset.index;
      element.classList.add('active');

      this.selectedCN.push({
        maCn: index,
        tenCn: element.innerText,
      });
    }
  }

  async onSearchCN(event: any) {
    let value = event.target.value;

    if (value) {
      this.CNInputConfig.data = this.CNInputConfig.data.filter((info: any) => {
        return info.tenCn.includes(value);
      });
    } else {
      await this.chuyenNganhService.getAll().then((data) => {
        this.CNInputConfig.data = data;
      });
    }
  }

  isCNExist(array: any[], item: any): boolean {
    return array.findIndex((i) => i.maCn === item.maCn) !== -1;
  }

  onClickInput(event: any) {
    event.stopPropagation();
  }

  async onAdd() {
    let formValue: any = this.dtForm.form.value;

    if (this.dtForm.form.valid) {
      const deTai = new DeTai();
      const raDe = new RaDe();
      const deTaiChuyenNganhs: DeTai_ChuyenNganh[] = [];

      raDe.init(formValue.maGv, formValue.maDT);

      this.selectedCN.forEach((item) => {
        let deTaiChuyenNganh = new DeTai_ChuyenNganh();

        deTaiChuyenNganh.init(item.maCn, formValue.maDT);
        deTaiChuyenNganhs.push(deTaiChuyenNganh);
      });

      deTai.init(
        formValue.tenDT,
        formValue.tomTat,
        formValue.slMin,
        formValue.slMax,
        shareService.namHoc,
        shareService.dot
      );

      try {
        await this.deTaiService.add(deTai);

        deTaiChuyenNganhs.forEach(async (item) => {
          await this.deTaiChuyenNganhService.add(item);
        });

        await this.raDeService.add(raDe);
        await this.setForm();
        this.websocketService.sendForDeTai(true);

        this.toastr.success('Thêm đề tài thành công', 'Thông báo !');
        this.router.navigate(['/ministry/de-tai/chi-tiet', { maDt: '' }]);
      } catch (error) {
        this.toastr.success('Thêm đề tài thất bại', 'Thông báo !');
      }
    } else {
      this.toastr.warning('Thông tin bạn cung cấp không hợp lệ', 'Thông báo !');
      this.dtForm.validate('.dt-form');
    }
  }

  setSelectedGV(event: any) {
    this.dtForm.form.patchValue({
      maGv: event.maGv,
    });
  }

  onDelete() {
    let formValue: any = this.dtForm.form.value;
    const _delete = document.querySelector('#delete')!;
    let option = new Option('#delete');

    _delete.classList.add('active');

    option.show('error', () => {
      _delete.classList.remove('active');
    });

    option.cancel(() => {
      _delete.classList.remove('active');
    });

    option.agree(async () => {
      try {
        const raDe = new RaDe();
        const deTaiChuyenNganhs: DeTai_ChuyenNganh[] = [];

        raDe.init(formValue.maGv, formValue.maDT);

        this.selectedCN.forEach((item) => {
          let deTaiChuyenNganh = new DeTai_ChuyenNganh();

          deTaiChuyenNganh.init(item.maCn, formValue.maDT);
          deTaiChuyenNganhs.push(deTaiChuyenNganh);
        });

        deTaiChuyenNganhs.forEach(async (item) => {
          await this.deTaiChuyenNganhService.delete(item.maDt, item.maCn);
        });

        await this.duyetDTService.delete(formValue.maGv, this.maDt, 1);
        await this.raDeService.delete(raDe.maGv, raDe.maDt);
        await this.deTaiService.delete(this.maDt);
        this.websocketService.sendForDeTai(true);

        this.toastr.success('Xóa Đề tài thành công', 'Đề tài!');
        this.router.navigate(['/ministry/de-tai/']);
      } catch (error) {
        this.toastr.error('Xóa Đề tài thất bại', 'Đề tài!');
      }
      _delete.classList.remove('active');
    });
  }

  getTenChuyennganhByMaDT(maDT: string) {
    let dtcns = this.listDeta_Chuyennganh.filter((item) => item.maDt == maDT);

    for (let item of dtcns) {
      this.selectedCN.push({
        ...item,
        tenCn: this.CNInputConfig.data.find((t: any) => t.maCn == item.maCn)
          ?.tenCn,
      });
    }
  }

  getGvRadeByMaDT(maDT: string) {
    return this.GVInputConfig.data.find(
      (t: any) => t.maGv === this.listRaDe.find((t) => t.maDt === maDT)?.maGv
    );
  }

  getTenGvDuyetByMaDT(maDT: string) {
    // return this.DSDTComponent.getTenGvDuyetByMaDT(maDT);
  }
}
