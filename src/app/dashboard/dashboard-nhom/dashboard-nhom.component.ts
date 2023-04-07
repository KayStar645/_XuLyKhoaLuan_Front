import { Component, AfterViewInit, ViewChildren, ElementRef, QueryList } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { shareService } from 'src/app/services/share.service';
import { thamGiaService } from 'src/app/services/thamGia.service';

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
    private route: ActivatedRoute,
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
    const tgia = this.thamGiaService.getById(
      id,
      shareService.namHoc,
      shareService.dot
    );
    if((await tgia).maNhom == null || (await tgia).maNhom == ''){
      this.router.navigate(['dashboard']);
    }
  }
}