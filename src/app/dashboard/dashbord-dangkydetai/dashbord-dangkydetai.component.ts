import { deTaiService } from './../../services/deTai.service';
import { Component } from '@angular/core';
import { DeTai } from 'src/app/models/DeTai.model';

@Component({
  selector: 'app-dashbord-dangkydetai',
  templateUrl: './dashbord-dangkydetai.component.html',
  styleUrls: ['./dashbord-dangkydetai.component.scss'],
})
export class DashbordDangkydetaiComponent {
  listDT: DeTai[] = [];

  constructor(private deTaiService: deTaiService) {}

  async OnInit() {
    // Chỉ trưởng nhóm mới được đăng ký, Đăng ký rồi thì đề tài biến mất, được phép hủy đăng ký để đăng ký lại
    // Thêm chức năng công bố đề tài trước khi tới đợt đăng ký 2 ngày
    this.listDT = await this.deTaiService.getAll();
    // Chỉ lấy những đề tài đã được duyệt, chưa đăng ký, chuyên ngành phù hợp và đã có giảng viên hướng dẫn
  }
}
