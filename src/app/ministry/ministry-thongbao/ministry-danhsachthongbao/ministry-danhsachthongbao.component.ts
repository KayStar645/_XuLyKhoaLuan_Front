import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  SimpleChanges,
} from '@angular/core';
import { ThongBao } from 'src/app/models/ThongBao.model';
import { shareService } from 'src/app/services/share.service';
import { thongBaoService } from 'src/app/services/thongBao.service';
import { getParentElement } from 'src/assets/utils';

@Component({
  selector: 'app-ministry-danhsachthongbao',
  templateUrl: './ministry-danhsachthongbao.component.html',
  styleUrls: ['./ministry-danhsachthongbao.component.scss'],
})
export class MinistryDanhsachthongbaoComponent {
  @Input() searchName = '';
  @Input() isSelectedTB = false;
  @Output() returnIsSelectedTB = new EventEmitter<boolean>();
  listTB: ThongBao[] = [];
  selectedTB: number[] = [];
  root: ThongBao[] = [];
  lineTB = new ThongBao();
  elementOld: any;

  constructor(
    private thongBaoService: thongBaoService,
    private elementRef: ElementRef,
    private shareService: shareService
  ) {}

  ngOnInit(): void {
    this.getAllThongBao();

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.selectedTB = [];
        this.returnIsSelectedTB.emit(false);
        let activeLine = this.elementRef.nativeElement.querySelectorAll(
          '.br-line.br-line-click'
        );

        if (activeLine) {
          activeLine.forEach((line: any) => {
            line.classList.remove('br-line-click');
          });
        }
      }
    });
  }

  clickLine(event: any) {
    const parent = getParentElement(event.target, '.br-line');
    const firstChild = parent.firstChild;
    const activeLine = this.elementRef.nativeElement.querySelector(
      '.br-line.br-line-dblclick'
    );

    !parent.classList.contains('br-line-dblclick') &&
      this.thongBaoService.getById(firstChild.innerText).subscribe((data) => {
        this.lineTB = data;
      });

    activeLine && activeLine.classList.remove('br-line-dblclick');
    parent.classList.add('br-line-dblclick');
  }

  getAllThongBao() {
    this.thongBaoService.getAll().subscribe((data) => {
      this.listTB = data;
      this.root = data;
    });
  }

  getSelectedLine(e: any) {
    if (e.ctrlKey) {
      this.returnIsSelectedTB.emit(true);
      const activeDblClick = this.elementRef.nativeElement.querySelector(
        '.br-line.br-line-dblclick'
      );
      const parent = getParentElement(e.target, '.br-line');
      const firstChild = parent.firstChild;

      if (activeDblClick) {
        activeDblClick.classList.remove('.br-line-dblclick');
        this.lineTB = new ThongBao();
      }

      if (parent.classList.contains('br-line-click')) {
        let childIndex = this.selectedTB.findIndex(
          (t) => t === firstChild.innerText
        );

        parent.classList.remove('br-line-click');
        this.selectedTB.splice(childIndex, 1);
      } else {
        parent.classList.add('br-line-click');
        this.selectedTB.push(firstChild.innerText);
      }

      if (this.selectedTB.length === 0) {
        this.returnIsSelectedTB.emit(false);
      }
    }
  }

  sortThongBao(sort: string) {
    // if (sort == 'asc-id') {
    //   this.listTB.sort((a, b) => a.maSv.localeCompare(b.maSv));
    // } else if (sort == 'desc-id') {
    //   this.listTB.sort((a, b) => b.maSv.localeCompare(a.maSv));
    // } else if (sort == 'asc-name') {
    //   this.listTB.sort((a, b) => a.tenTb.localeCompare(b.tenTb));
    // } else if (sort == 'desc-name') {
    //   this.listTB.sort((a, b) => b.tenTb.localeCompare(a.tenTb));
    // } else {
    //   this.thongBaoService.getAll().subscribe((data) => {
    //     this.listTB = data;
    //   });
    // }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.searchName) {
      this.filterItems();
    }
  }

  filterItems() {
    const searchName = this.searchName.trim().toLowerCase();
    this.listTB = this.root.filter((item) =>
      item.tenTb.toLowerCase().includes(searchName)
    );
  }

  dateFormat(str: string) {
    return this.shareService.dateFormat(str);
  }
}
