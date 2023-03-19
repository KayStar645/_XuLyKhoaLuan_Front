import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ThongBao } from 'src/app/models/ThongBao.model';
import { thongBaoService } from 'src/app/services/thongBao.service';
import { Form } from 'src/assets/utils';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-ministry-chitietthongbao',
  templateUrl: './ministry-chitietthongbao.component.html',
  styleUrls: ['./ministry-chitietthongbao.component.scss'],
})
export class MinistryChitietthongbaoComponent implements OnInit {
  maTb: number = -1;
  thongBao: ThongBao = new ThongBao();
  tbForm = new Form({
    maTb: ['', Validators.required],
    tenTb: ['', Validators.required],
    noiDung: [''],
    hinhAnh: ['', Validators.required],
    fileTb: [''],
    maKhoa: ['', Validators.required],
    ngayTb: ['', Validators.required],
  });
  notifyNameConfig = {
    toolbar: [['bold', 'italic', 'underline'], [{ color: [] }], ['clean']],
  };

  notifyContentConfig = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'], // toggled buttons
      ['blockquote', 'code-block'],

      [{ header: 1 }, { header: 2 }], // custom button values
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
      [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
      [{ direction: 'rtl' }], // text direction

      [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      [{ color: [] }, { background: [] }], // dropdown with defaults from theme
      [{ font: [] }],
      [{ align: [] }],

      ['clean'], // remove formatting button

      ['link', 'image', 'video'], // link and image, video
    ],
  };

  constructor(
    private route: ActivatedRoute,
    private thongBaoService: thongBaoService
  ) {}

  async ngOnInit() {
    this.route.params.subscribe((params) => {
      this.maTb = parseInt(params['maTb']);
    });

    await this.thongBaoService.getById(this.maTb).then((data) => {
      this.thongBao = data;
    });

    this.tbForm.form.patchValue({
      tenTb: this.thongBao.tenTb,
    });
  }

  randomeNumber(length: number): number {
    let result = '';
    const characters = '0123456789';
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return parseInt(result);
  }
}
