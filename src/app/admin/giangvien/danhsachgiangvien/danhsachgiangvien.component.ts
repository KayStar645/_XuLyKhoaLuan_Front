import { Component, ElementRef, OnInit } from '@angular/core';

@Component({
  selector: 'app-danhsachgiangvien',
  templateUrl: './danhsachgiangvien.component.html',
  styleUrls: ['./danhsachgiangvien.component.scss']
})
export class DanhsachgiangvienComponent implements OnInit {

  constructor(private elementRef: ElementRef) { }

  ngOnInit(): void {
    
  }

  clickLine() {
    const lines = this.elementRef.nativeElement.querySelector('.br-line');
  }

}
