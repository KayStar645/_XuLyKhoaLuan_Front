import { Component, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CongViec } from 'src/app/models/CongViec.model';
import { congViecService } from 'src/app/services/congViec.service';
import { giangVienService } from 'src/app/services/giangVien.service';
import { shareService } from 'src/app/services/share.service';

@Component({
  selector: 'app-dashboard-baitapchitiet',
  templateUrl: './dashboard-baitapchitiet.component.html',
  styleUrls: ['./dashboard-baitapchitiet.component.scss']
})
export class DashboardBaitapchitietComponent {
  congViec = new CongViec();
  tenGv = '';
  
  constructor(
    private route: ActivatedRoute,
    private congViecService: congViecService,
    private giangVienService: giangVienService,
    private shareService: shareService,
    private elementRef: ElementRef,
  ) {}

  async ngOnInit() {
    this.route.params.subscribe(async (params) => {
      this.congViec = await this.congViecService.getById(params['maCv']);
      this.tenGv = (await this.giangVienService.getById(this.congViec.maGv)).tenGv;
    });
  }

  dateFormat(str: string) {
    return this.shareService.dateFormat(str);
  }

  onShowFormDrag(){
    let drag = this.elementRef.nativeElement.querySelector('#drag-file');
    let dragBox = this.elementRef.nativeElement.querySelector('#drag-file_box');

    drag.classList.add('active');
    dragBox.classList.add('active');
  }

  onCloseDrag(event: any) {
    let dragBox = this.elementRef.nativeElement.querySelector('#drag-file_box');

    event.target.classList.remove('active');
    dragBox.classList.remove('active');
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
  }

  onFileInput(event: any) {
    let file = event.target.files[0];
  }
}
