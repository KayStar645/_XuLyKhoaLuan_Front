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
import { Form, Option } from 'src/assets/utils';

@Component({
  selector: 'app-ministry-chitietdetai',
  templateUrl: './ministry-chitietdetai.component.html',
  styleUrls: ['./ministry-chitietdetai.component.scss'],
})
export class MinistryChitietdetaiComponent {
  maDt: string = '';
  oldForm: any;
  deTai: DeTai = new DeTai();
  listSV: SinhVien[] = [];
  slMin: number = 1;
  slMax: number = 3;

  dtForm = new Form({
    maDT: ['', Validators.required],
    tenDT: ['', Validators.required],
    tomTat: ['', Validators.required],
    slMin: ['', Validators.required],
    slMax: ['', Validators.required],
    trangThai: [false, Validators.required],
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
    private deTaiService: deTaiService,
    private sinhVienService: sinhVienService,
    private toastr: ToastrService,
    private websocketService: WebsocketService
  ) {}

  async ngOnInit() {
    this.route.params.subscribe((params) => {
      this.maDt = params['maDt'];
      this.setForm();
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

  async onAdd() {
    let formValue: any = this.dtForm.form.value;

    if (this.dtForm.form.valid) {
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
        await this.deTaiService.add(deTai);
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

  setSelectedNV(event: any) {
    this.dtForm.form.patchValue({
      maGv: event.maGv,
      maBm: event.maBm,
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
          formValue.trangThai
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

  async getGVienById(id: string) {
    return await this.sinhVienService.getById(id).then((data) => {
      return data;
    });
  }
}
