import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { format } from 'date-fns';
import { ToastrService } from 'ngx-toastr';
import { DeTai } from 'src/app/models/DeTai.model';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { deTaiService } from 'src/app/services/deTai.service';
import { shareService } from 'src/app/services/share.service';
import { sinhVienService } from 'src/app/services/sinhVien.service';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { Form, Option, getParentElement } from 'src/assets/utils';
import { MinistryDanhsachdetaiComponent } from '../ministry-danhsachdetai/ministry-danhsachdetai.component';
import { giangVienService } from 'src/app/services/giangVien.service';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { RaDe } from 'src/app/models/RaDe.model';
import { DeTai_ChuyenNganh } from 'src/app/models/DeTai_ChuyenNganh.model';
import { deTai_chuyenNganhService } from 'src/app/services/deTai_chuyenNganh.service';
import { raDeService } from 'src/app/services/raDe.service';

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
  slMin: number = 1;
  slMax: number = 3;

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
    private sharedService: shareService,
    private giangVienService: giangVienService,
    private chuyenNganhService: chuyenNganhService,
    private deTaiChuyenNganhService: deTai_chuyenNganhService,
    private deTaiService: deTaiService,
    private raDeService: raDeService,
    private sinhVienService: sinhVienService,
    private toastr: ToastrService,
    private websocketService: WebsocketService
  ) {}

  async ngOnInit() {
    this.route.params.subscribe((params) => {
      this.maDt = params['maDt'];
      this.setForm();
    });

    await this.giangVienService.getAll().then((data) => {
      this.GVInputConfig.data = data;
      this.GVInputConfig.keyword = 'tenGv';
    });

    await this.chuyenNganhService.getAll().then((data) => {
      this.CNInputConfig.data = data;
      this.CNInputConfig.keyword = 'tenCn';
    });

    this.websocketService.startConnection();
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

  updateDeTai() {
    let formValue: any = this.dtForm.form.value;

    if (this.dtForm.form.valid) {
      if (
        JSON.stringify(this.oldForm) === JSON.stringify(this.dtForm.form.value)
      ) {
        this.toastr.warning(
          'Thông tin bạn cung cấp không thay đổi kể từ lần cuối cập nhập.',
          'Thông báo !'
        );
      } else {
        const deTai = new DeTai();
        deTai.init(
          formValue.maDT,
          formValue.tenDT,
          formValue.tomTat,
          formValue.slMin,
          formValue.slMax,
          formValue.trangThai
        );
        try {
          this.f_UpdateDetai(deTai);
          this.toastr.success(
            'Cập nhập thông tin đề tài viên thành công',
            'Thông báo !'
          );
        } catch {
          this.toastr.error(
            'Thông tin bạn cung cấp không hợp lệ.',
            'Thông báo !'
          );
        }
      }
    } else {
      this.dtForm.validate('#update_box');
    }
  }

  async f_UpdateDetai(dt: DeTai) {
    await this.deTaiService.update(dt);
  }

  async setForm() {
    if (this.maDt) {
      await this.deTaiService.getById(this.maDt).then(async (data) => {
        this.deTai = data;

        this.dtForm.form.patchValue({
          ...this.deTai,
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
        formValue.maDT,
        formValue.tenDT,
        formValue.tomTat,
        formValue.slMin,
        formValue.slMax,
        formValue.trangThai
      );

      try {
        await this.deTaiService.add(deTai);

        deTaiChuyenNganhs.forEach(async (item) => {
          await this.deTaiChuyenNganhService.add(item);
        });

        await this.raDeService.add(raDe);
        this.toastr.success('Thêm đề tài thành công', 'Thông báo !');
        this.router.navigate(['/ministry/de-tai/chi-tiet', { maDt: '' }]);
        this.setForm();
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

  async onUpdate() {
    if (this.dtForm.form.valid) {
      if (
        JSON.stringify(this.oldForm) !== JSON.stringify(this.dtForm.form.value)
      ) {
        let deTai = new DeTai();
        let formValue: any = this.dtForm.form.value;
        deTai.init(
          this.maDt,
          formValue.tenDT,
          formValue.tomTat,
          formValue.slMin,
          formValue.slMax,
          JSON.parse(formValue.trangThai)
        );

        try {
          await this.deTaiService.update(deTai);

          this.toastr.success('Cập nhập Đề tài thành công', 'Thông báo !');
        } catch (error) {
          this.toastr.error('Cập nhập Đề tài thất bại', 'Thông báo !');
        }
      } else {
        this.toastr.info(
          'Thông tin của bạn không thay đổi kể từ lần cuối',
          'Thông báo !'
        );
      }
    } else {
      this.toastr.warning('Thông tin bạn cung cấp không hợp lệ', 'Đề tài!');
      this.dtForm.validate('.dt-form');
    }
  }

  onDelete() {
    const _delete = document.querySelector('#delete')!;

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
        await this.deTaiService.delete(this.maDt);
        this.toastr.success('Xóa Đề tài thành công', 'Đề tài!');
        this.router.navigate(['/ministry/de-tai/']);
      } catch (error) {
        this.toastr.error('Xóa Đề tài thất bại', 'Đề tài!');
      }
      _delete.classList.remove('active');
    });
  }

  getTenChuyennganhByMaDT(maDT: string) {
    return this.DSDTComponent.getTenChuyennganhByMaDT(maDT);
  }

  getTenGvRadeByMaDT(maDT: string) {
    return this.DSDTComponent.getTenGvDuyetByMaDT(maDT);
  }

  getTenGvDuyetByMaDT(maDT: string) {
    return this.DSDTComponent.getTenGvDuyetByMaDT(maDT);
  }

  async getGVienById(id: string) {
    return await this.sinhVienService.getById(id).then((data) => {
      return data;
    });
  }
}
