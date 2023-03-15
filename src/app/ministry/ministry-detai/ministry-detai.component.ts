import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { DeTai } from 'src/app/models/DeTai.model';
import { deTaiService } from 'src/app/services/deTai.service';
import { Form, getParentElement, Option } from 'src/assets/utils';
import * as XLSX from 'xlsx';
import { MinistryDanhsachdetaiComponent } from './ministry-danhsachdetai/ministry-danhsachdetai.component';

@Component({
  selector: 'app-ministry-detai',
  templateUrl: './ministry-detai.component.html',
  styleUrls: ['./ministry-detai.component.scss'],
})
export class MinistryDetaiComponent implements OnInit {
  @ViewChild(MinistryDanhsachdetaiComponent)
  private DSDTComponent!: MinistryDanhsachdetaiComponent;
  dtUpdate: any = DeTai;
  searchName = '';
  selectedBomon!: string;
  deTaiFile: any;

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
    private toastr: ToastrService
  ) {
    this.dtAddForm = this.dtForm.form;
    this.dtUpdateForm = this.dtForm.form;
  }

  ngOnInit(): void {
    this.titleService.setTitle('Danh sách đề tài');
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

  onShowFormUpdate() {
    let updateBox = this.elementRef.nativeElement.querySelector('#update_box');
    let update = this.elementRef.nativeElement.querySelector('#update');

    if (Object.entries(this.DSDTComponent.lineDT).length > 0) {
      this.dtForm.form.setValue({
        ...this.DSDTComponent.lineDT,
        trangThai: JSON.stringify(this.DSDTComponent.lineDT.trangThai),
      });

      updateBox.classList.add('active');
      update.classList.add('active');
      this.dtOldForm = this.dtForm.form.value;
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

    if (this.dtForm.isHaveValue(this.exceptInput)) {
      let option = new Option('#create_box');

      option.show('warning');

      option.cancel();

      option.agree(() => {
        this.resetForm('#create_box');
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
      JSON.stringify(this.dtOldForm) !== JSON.stringify(this.dtForm.form.value)
    ) {
      let option = new Option('#update_box');

      option.show('warning');

      option.cancel();

      option.agree(() => {
        updateBox.classList.remove('active');
        update.classList.remove('active');
        this.dtForm.resetValidte('#update_box');
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
        data[2] = data[2] ? XLSX.SSF.format('yyyy-MM-dd', data[2]) : undefined;
        data[8] = data[8] ? XLSX.SSF.format('yyyy-MM-dd', data[8]) : undefined;
        data[9] = data[9] ? XLSX.SSF.format('yyyy-MM-dd', data[9]) : undefined;
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

  onReadFile() {
    if (this.deTaiFile.data.length > 0) {
      const datas = this.deTaiFile.data;

      datas.forEach((data: any) => {
        let gv = new DeTai();
        gv.init(
          data[0] ? data[0] : '',
          data[1] ? data[1] : '',
          data[2] ? data[2] : '',
          data[3] ? data[3] : '',
          data[4] ? data[4] : '',
          data[5] ? data[5] : ''
        );
        this.deTaiService.add(gv).subscribe(
          (data) => {
            this.toastr.success('Thêm đề tài thành công', 'Thông báo !');
          },
          (error) => {
            this.toastr.error(
              'Thông tin bạn cung cấp không hợp lệ.',
              'Thông báo !'
            );
          }
        );
      });

      this.DSDTComponent.getAllDeTai();
    }
  }

  clickDelete() {
    const _delete = this.elementRef.nativeElement.querySelector('#delete');

    if (Object.entries(this.DSDTComponent.lineDT).length > 0) {
      _delete.classList.add('active');
      let option = new Option('#delete');

      option.show('error', () => {
        _delete.classList.remove('active');
      });

      option.cancel(() => {
        _delete.classList.remove('active');
      });

      option.agree(() => {
        this.deTaiService.delete(this.DSDTComponent.lineDT.maDT).subscribe(
          (data) => {
            this.toastr.success('Xóa đề tài thành công', 'Thông báo !');
            this.DSDTComponent.lineDT = new DeTai();
            this.DSDTComponent.getAllDeTai();
          },
          (error) => {
            this.toastr.error('Xóa đề tài thất bại', 'Thông báo !');
          }
        );
        _delete.classList.remove('active');
      });
    } else {
      this.toastr.warning('Vui lòng chọn đề tài để xóa', 'Thông báo !');
    }
    this.toastr.clear();
  }

  addDeTai() {
    this.dtForm.form.patchValue({
      trangThai: 'false',
    });

    if (this.dtAddForm.valid) {
      const deTai = new DeTai();
      deTai.init(
        this.dtAddForm.value['maDT'],
        this.dtAddForm.value['tenDT'],
        this.dtAddForm.value['tomTat'],
        this.dtAddForm.value['slMin'],
        this.dtAddForm.value['slMax'],
        false
      );

      this.deTaiService.add(deTai).subscribe(
        (data) => {
          this.resetForm('#create_box');
          this.toastr.success('Thêm đề tài thành công', 'Thông báo !');
          this.DSDTComponent.getAllDeTai();
        },
        (error) => {
          this.toastr.error(
            'Thông tin bạn cung cấp không hợp lệ.',
            'Thông báo !'
          );
        }
      );
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

  resetLineActive() {
    this.DSDTComponent.lineDT = new DeTai();
    this.elementRef.nativeElement
      .querySelector('.table tr.br-line-hover')
      .classList.remove('br-line-hover');
  }

  updateDeTai() {
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
          this.dtUpdateForm.value['maDT'],
          this.dtUpdateForm.value['tenDT'],
          this.dtUpdateForm.value['tomTat'],
          this.dtUpdateForm.value['slMin'],
          this.dtUpdateForm.value['slMax'],
          this.dtUpdateForm.value['trangThai'] === 'false' ? false : true
        );

        this.deTaiService.update(deTai).subscribe(
          (data) => {
            update.classList.remove('active');
            updateBox.classList.remove('active');
            this.DSDTComponent.getAllDeTai();
            this.resetLineActive();
            this.toastr.success(
              'Cập nhập thông tin đề tài viên thành công',
              'Thông báo !'
            );
          },
          (error) => {
            this.toastr.error(
              'Thông tin bạn cung cấp không hợp lệ.',
              'Thông báo !'
            );
          }
        );
      }
    } else {
      this.dtForm.validate('#update_box');
    }
  }

  getGiangVienByMaCn(event: any) {
    const maBM = event.target.value;
    if (maBM == '') {
      this.DSDTComponent.getAllDeTai();
    } else {
      this.DSDTComponent.getGiangVienByMaCn(maBM);
    }
  }

  sortGiangVien(event: any) {
    const sort = event.target.value;
    this.DSDTComponent.sortGiangVien(sort);
  }
}
