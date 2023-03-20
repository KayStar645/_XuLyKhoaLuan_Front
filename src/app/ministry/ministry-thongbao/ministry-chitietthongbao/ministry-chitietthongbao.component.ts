import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';
import { ThongBao } from 'src/app/models/ThongBao.model';
import { thongBaoService } from 'src/app/services/thongBao.service';
import { Form } from 'src/assets/utils';
import { environment } from 'src/environments/environment';
import { format } from 'date-fns';

@Component({
  selector: 'app-ministry-chitietthongbao',
  templateUrl: './ministry-chitietthongbao.component.html',
  styleUrls: ['./ministry-chitietthongbao.component.scss'],
})
export class MinistryChitietthongbaoComponent implements OnInit {
  maTb: number = -1;
  pdfSrc: any;
  thongBao: ThongBao = new ThongBao();
  tbForm = new Form({
    tenTb: ['', Validators.required],
    noiDung: [''],
    hinhAnh: ['man_with_tab.png', Validators.required],
    fileTb: [''],
    maKhoa: ['CNTT', Validators.required],
    ngayTb: [format(new Date(), 'dd/MM/yyyy')],
  });
  notifyNameConfig = {
    toolbar: [['bold', 'italic', 'underline'], [{ color: [] }], ['clean']],
  };

  notifyContentConfig = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ color: [] }],
      [{ align: [] }],
      ['link'],
      ['clean'],
    ],
  };

  constructor(
    private route: ActivatedRoute,
    private thongBaoService: thongBaoService,
    private toastr: ToastrService
  ) {}

  async ngOnInit() {
    this.route.params.subscribe((params) => {
      this.maTb = parseInt(params['maTb']);
    });

    if (this.maTb > 0) {
      await this.thongBaoService
        .getById(this.maTb)
        .then((data) => {
          this.thongBao = data;
          return data;
        })
        .then((response) => {
          axios
            .get(environment.githubNotifyFilesAPI + response.fileTb)
            .then((response) => {
              this.pdfSrc = response.data.download_url;
            });
        });

      this.tbForm.form.patchValue({
        ...this.thongBao,
      });
    }
  }

  onChange(event: any) {
    let $img: any = event.target;

    this.tbForm.form.patchValue({
      fileTb: event.target.files[0].name,
    });

    if (typeof FileReader !== 'undefined') {
      let reader = new FileReader();

      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
      };

      reader.readAsArrayBuffer($img.files[0]);
    }
  }

  onShowFormUpdate() {}

  async onAdd() {
    if (this.tbForm.form.valid) {
      let thongBao = new ThongBao();
      let formValue: any = this.tbForm.form.value;
      thongBao.init(
        formValue.tenTb,
        formValue.noiDung,
        formValue.hinhAnh,
        formValue.fileTb,
        formValue.maKhoa,
        formValue.ngayTb
      );
      console.log(thongBao);
      try {
        await this.thongBaoService.add(thongBao);
        this.toastr.success('Thêm đề tài thành công', 'Thông báo !');
      } catch (error) {
        this.toastr.error('Thêm đề tài thất bại', 'Thông báo !');
      }
    } else {
      this.toastr.warning('Thông tin bạn cung cấp không hợp lệ', 'Thông báo!');
    }
  }

  onUpdate() {}

  onDelete() {}

  randomNumber(length: number): number {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return parseInt(result);
  }
}
