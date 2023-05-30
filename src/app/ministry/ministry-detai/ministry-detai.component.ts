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
import { MinistryDanhsachdetaiComponent } from './ministry-danhsachdetai/ministry-danhsachdetai.component';
import { shareService } from 'src/app/services/share.service';

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
    private chuyenNganhService: chuyenNganhService,
    private shareService: shareService
  ) {
    this.dtAddForm = this.dtForm.form;
    this.dtUpdateForm = this.dtForm.form;
  }

  async ngOnInit() {
    this.titleService.setTitle('Danh sách đề tài');
    this.listCn = await this.chuyenNganhService.getAll();
  }
}
