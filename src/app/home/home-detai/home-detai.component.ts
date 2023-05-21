import { chuyenNganhService } from './../../services/chuyenNganh.service';
import { ChuyenNganh } from './../../models/ChuyenNganh.model';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { DeTai } from 'src/app/models/DeTai.model';
import { deTaiService } from 'src/app/services/deTai.service';
import { Form, getParentElement, Option } from 'src/assets/utils';
import * as XLSX from 'xlsx';
import { HomeDanhsachdetaiComponent } from './home-danhsachdetai/home-danhsachdetai.component';
import { HomeComponent } from '../home.component';
import { shareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-home-detai',
  templateUrl: './home-detai.component.html',
  styleUrls: ['./home-detai.component.scss'],
})
export class HomeDetaiComponent implements OnInit {
  @ViewChild(HomeDanhsachdetaiComponent)
  private DSDTComponent!: HomeDanhsachdetaiComponent;
  dtUpdate: any = DeTai;
  searchName = '';
  selectedBomon!: string;
  slMin: number = 1;
  slMax: number = 3;
  isSelectedDT: boolean = false;
  deTaiFile: any;
  listCn: ChuyenNganh[] = [];

  dtAddForm: any;
  dtUpdateForm: any;
  dtOldForm: any;
  isSummary: boolean = false;

  dtForm = new Form({
    maDT: ['', Validators.required],
    tenDT: ['', Validators.required],
    tomTat: ['', Validators.required],
    slMin: ['', Validators.required],
    slMax: ['', Validators.required],
    trangThai: ['', Validators.required],
  });

  exceptInput = ['slMin', 'slMax'];

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
    private titleService: Title,
    private elementRef: ElementRef,
    private deTaiService: deTaiService,
    private toastr: ToastrService,
    private chuyenNganhService: chuyenNganhService
  ) {
    this.dtAddForm = this.dtForm.form;
    this.dtUpdateForm = this.dtForm.form;
  }

  async ngOnInit() {
    this.titleService.setTitle('Danh sách đề tài');
    this.listCn = await this.chuyenNganhService.getAll();
  }

  setIsSelectedDT(event: any) {
    this.isSelectedDT = event;
  }

  setSlMax(event: any) {
    const currentValue = parseInt(event.target.value);
    const previousValue = parseInt(event.target.defaultValue);

    if (currentValue > previousValue) {
      this.slMax += 1;
    } else if (currentValue < previousValue) {
      this.slMax += 1;
    }
  }

  resetForm(formSelector: string = '#create_box') {
    this.dtForm.resetForm(formSelector, this.exceptInput);

    this.dtForm.form.patchValue({
      trangThai: '',
      slMin: 1,
      slMax: 3,
    });
  }

  onShowFormAdd() {
    let createBox = this.elementRef.nativeElement.querySelector('#create_box');
    let create = this.elementRef.nativeElement.querySelector('#create');
    this.resetForm('#create_box');

    createBox.classList.add('active');
    create.classList.add('active');
  }

  handleToggleAdd() {
    let createBox = this.elementRef.nativeElement.querySelector('#create_box');
    let create = this.elementRef.nativeElement.querySelector('#create');

    if (this.dtForm.isHaveValue(this.exceptInput)) {
      let option = new Option('#create_box');

      option.show('warning', () => {
        create.classList.remove('active');
      });

      option.cancel(() => {
        create.classList.remove('active');
      });

      option.agree(() => {
        this.resetForm('#create_box');
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
      JSON.stringify(this.dtOldForm) !== JSON.stringify(this.dtForm.form.value)
    ) {
      let option = new Option('#update_box');

      option.show('warning', () => {
        update.classList.remove('active');
      });

      option.cancel(() => {
        update.classList.remove('active');
      });

      option.agree(() => {
        update.classList.remove('active');
        this.dtForm.resetValidate('#update_box');
      });

      option.save(() => {
        this.updateDeTai();
        update.classList.remove('active');
        updateBox.classList.remove('active');
      });
    } else {
      update.classList.remove('active');
      updateBox.classList.remove('active');
    }
  }

  onBlur(event: any) {
    this.dtForm.inputBlur(event);
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

  onDropFile(event: any) {
    event.preventDefault();
    let file = event.dataTransfer.files[0];
    this.readExcelFile(file);
  }

  onFileInput(event: any) {
    let file = event.target.files[0];

    this.readExcelFile(file);
  }

  readExcelFile(file: any) {
    const fileReader = new FileReader();

    fileReader.readAsArrayBuffer(file);
    fileReader.onload = (event) => {
      const arrayBuffer: any = fileReader.result;
      const data = new Uint8Array(arrayBuffer);
      const workBook = XLSX.read(data, { type: 'array' });
      const workSheet = workBook.Sheets[workBook.SheetNames[0]];
      const excelData = XLSX.utils.sheet_to_json(workSheet, { header: 1 });
      const datas = excelData
        .slice(1, excelData.length)
        .filter((data: any) => data.length > 0);

      datas.forEach((data: any, i) => {
        data[1] = `<p>${data[1].replaceAll('\r\n', ' ')}</p>`;
        data[2] = data[2].split('\r\n');
        data[2] = data[2].map((line: string) => `<p>${line}</p>`);

        data[2] = data[2].join('');
      });
      this.deTaiFile = {
        name: file.name,
        size: (file.size / 1024).toFixed(2) + 'MB',
        data: datas,
      };
    };
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

  async onReadFile() {
    if (this.deTaiFile.data.length > 0) {
      const datas = this.deTaiFile.data;

      datas.forEach(async (data: any) => {
        let dt = new DeTai();
        dt.init(
          '',
          data[0] ? data[0] : '',
          data[1] ? data[1] : '',
          data[2] ? data[2] : '',
          data[3] ? data[3] : '',
          HomeComponent.namHoc,
          HomeComponent.dot
        );
        this.f_AddDetai(dt);
      });

      this.DSDTComponent.getAllDeTai();
    }
  }

  async addDeTai() {
    this.dtForm.form.patchValue({
      trangThai: 'false',
    });

    if (this.dtAddForm.valid) {
      const deTai = new DeTai();
      deTai.init(
        '',
        this.dtAddForm.value['tenDT'],
        this.dtAddForm.value['tomTat'],
        this.dtAddForm.value['slMin'],
        this.dtAddForm.value['slMax'],
        shareService.namHoc,
        shareService.dot
      );
      this.f_AddDetai(deTai);
    } else {
      this.dtForm.validate('#create_box');
    }
  }

  onShowFormDrag() {
    let drag = this.elementRef.nativeElement.querySelector('#drag-file');
    let dragBox = this.elementRef.nativeElement.querySelector('#drag-file_box');

    drag.classList.add('active');
    dragBox.classList.add('active');
  }

  async updateDeTai() {
    let update = this.elementRef.nativeElement.querySelector('#update');
    let updateBox = this.elementRef.nativeElement.querySelector('#update_box');

    if (this.dtUpdateForm.valid) {
      if (
        JSON.stringify(this.dtOldForm) ===
        JSON.stringify(this.dtForm.form.value)
      ) {
        this.toastr.warning(
          'Thông tin bạn cung cấp không thay đổi kể từ lần cuối cập nhập.',
          'Thông báo !'
        );
      } else {
        const deTai = new DeTai();
        deTai.init(
          '',
          this.dtUpdateForm.value['tenDT'],
          this.dtUpdateForm.value['tomTat'],
          this.dtUpdateForm.value['slMin'],
          this.dtUpdateForm.value['slMax'],
          shareService.namHoc,
          shareService.dot
        );
        try {
          this.f_UpdateDetai(deTai);
          update.classList.remove('active');
          updateBox.classList.remove('active');
          this.DSDTComponent.getAllDeTai();
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

  async f_AddDetai(dt: DeTai) {
    try {
      await this.deTaiService.add(dt);
      this.toastr.success('Thêm đề tài thành công', 'Thông báo !');
      this.DSDTComponent.getAllDeTai();
      this.resetForm('#create_box');
    } catch {
      this.toastr.error('Thông tin bạn cung cấp không hợp lệ.', 'Thông báo !');
    }
  }

  async f_UpdateDetai(dt: DeTai) {
    await this.deTaiService.update(dt);
  }
}
