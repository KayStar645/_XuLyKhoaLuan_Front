import { shareService } from 'src/app/services/share.service';
import { HomeMainComponent } from './../../home-main/home-main.component';
import { Component } from '@angular/core';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeTai } from 'src/app/models/DeTai.model';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { deTaiService } from 'src/app/services/deTai.service';
import { WebsocketService } from 'src/app/services/Websocket.service';
import { Form, getParentElement } from 'src/assets/utils';
import { giangVienService } from 'src/app/services/giangVien.service';
import { chuyenNganhService } from 'src/app/services/chuyenNganh.service';
import { RaDe } from 'src/app/models/RaDe.model';
import { DeTai_ChuyenNganh } from 'src/app/models/DeTai_ChuyenNganh.model';
import { deTai_chuyenNganhService } from 'src/app/services/deTai_chuyenNganh.service';
import { raDeService } from 'src/app/services/raDe.service';
import { HomeDanhsachdetaiComponent } from '../home-danhsachdetai/home-danhsachdetai.component';

@Component({
  selector: 'app-home-formdetai',
  templateUrl: './home-formdetai.component.html',
  styleUrls: ['./home-formdetai.component.scss'],
})
export class HomeFormdetaiComponent {
  DSDTComponent!: HomeDanhsachdetaiComponent;

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
    tenDT: ['', Validators.required],
    tomTat: ['', Validators.required],
    slMin: ['', Validators.required],
    slMax: ['', Validators.required],
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
    private router: Router,
    private giangVienService: giangVienService,
    private chuyenNganhService: chuyenNganhService,
    private deTaiChuyenNganhService: deTai_chuyenNganhService,
    private deTaiService: deTaiService,
    private raDeService: raDeService,
    private toastr: ToastrService,
    private websocketService: WebsocketService,
    private shareService: shareService
  ) {}

  async ngOnInit() {
    this.listRaDe = await this.raDeService.getAll();

    this.listDeta_Chuyennganh = await this.deTaiChuyenNganhService.getAll();

    this.GVInputConfig.data = await this.giangVienService.getAll();
    this.GVInputConfig.keyword = 'tenGv';

    this.CNInputConfig.data = await this.chuyenNganhService.getAll();
    this.CNInputConfig.keyword = 'tenCn';

    this.websocketService.startConnection();
  }

  onBlur(event: any) {
    this.dtForm.inputBlur(event);
  }

  setSlMax(event: any) {
    let formValue: any = this.dtForm.form.value;
    const currentValue = parseInt(event.target.value);
    const previousValue = parseInt(event.target.defaultValue);

    if (currentValue > previousValue) {
      this.slMax += 1;
    } else if (currentValue < previousValue) {
      this.slMax -= 1;
    }

    if (currentValue < formValue.slMin) {
      this.dtForm.form.patchValue({
        slMin: currentValue - 1,
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
      try {
        const deTai = new DeTai();
        deTai.init(
          '',
          formValue.tenDT,
          formValue.tomTat,
          formValue.slMin,
          formValue.slMax,
          shareService.namHoc,
          shareService.dot
        );
        let dt = await this.deTaiService.add(deTai);

        const raDe = new RaDe();
        raDe.init(HomeMainComponent.maGV, dt.maDT);

        const deTaiChuyenNganhs: DeTai_ChuyenNganh[] = [];
        this.selectedCN.forEach((item) => {
          let deTaiChuyenNganh = new DeTai_ChuyenNganh();

          deTaiChuyenNganh.init(item.maCn, dt.maDT);
          deTaiChuyenNganhs.push(deTaiChuyenNganh);
        });
        deTaiChuyenNganhs.forEach(async (item) => {
          await this.deTaiChuyenNganhService.add(item);
        });

        await this.raDeService.add(raDe);
        this.toastr.success('Thêm đề tài thành công', 'Thông báo !');
        this.router.navigate(['/home/de-tai', { maDt: '' }]);
      } catch (error) {
        this.toastr.error('Thêm đề tài thất bại', 'Thông báo !');
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
}
