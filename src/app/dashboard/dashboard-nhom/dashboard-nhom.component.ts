import { Component, AfterViewInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { Router } from '@angular/router';
import { shareService } from 'src/app/services/share.service';
import { thamGiaService } from 'src/app/services/thamGia.service';
import { DashboardComponent } from '../dashboard.component';

@Component({
  selector: 'app-dashboard-nhom',
  templateUrl: './dashboard-nhom.component.html',
  styleUrls: ['./dashboard-nhom.component.scss']
})
export class DashboardNhomComponent implements AfterViewInit {
  activeLinkIndex = 0;

  constructor(
    private shareService: shareService,
    private router: Router,
    private thamGiaService: thamGiaService,
  ) {}

  @ViewChildren('link') links!: QueryList<ElementRef>;

  ngAfterViewInit() {
    this.links.forEach((link, index) => {
      if (index !== this.activeLinkIndex) {
        link.nativeElement.classList.remove('active');
      }
    });
  }

  async ngOnInit(){
    const id = localStorage.getItem('Id')?.toString() + '';
    const namHoc = this.shareService.getNamHoc();
    const dot = this.shareService.getDot();

    //Nếu không có trong tham gia không được mời quay trở lại trang chủ
    if(await this.thamGiaService.isJoinedAGroup(DashboardComponent.maSV, this.shareService.getNamHoc(), this.shareService.getDot()) == false){
      this.router.navigate(['dashboard']);
    }

    if(await this.thamGiaService.isJoinedAGroup(id, namHoc, dot)){
      const tgia = this.thamGiaService.getById(id, namHoc, dot);
      if((await tgia).maNhom == null || (await tgia).maNhom == ''){
        this.router.navigate(['dashboard']);
      }
    }
  }
}