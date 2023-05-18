import { async } from 'rxjs';
import { sinhVienService } from './../../../../services/sinhVien.service';
import { BaoCaoVT } from 'src/app/models/VirtualModel/BaoCaoVTModel';
import { baoCaoService } from './../../../../services/baoCao.service';
import { Component, OnInit } from '@angular/core';
import { SinhVien } from 'src/app/models/SinhVien.model';
import { format } from 'date-fns';
import axios from 'axios';
import { environment } from 'src/environments/environment.prod';

@Component({
  selector: 'app-home-danhsachnopbai',
  templateUrl: './home-danhsachnopbai.component.html',
  styleUrls: ['./home-danhsachnopbai.component.scss'],
})
export class HomeDanhsachnopbaiComponent implements OnInit {
  maCv = '';
  maDt = '';
  maNhom = '';
  baoCaos: any[] = [];
  sinhViens: SinhVien[] = [];
  types = ['xlsx', 'jpg', 'png', 'pptx', 'sql', 'docx', 'txt', 'pdf', 'rar'];

  constructor(
    private baoCaoService: baoCaoService,
    private sinhVienService: sinhVienService
  ) {}

  async ngOnInit(): Promise<void> {
    this.maCv = window.history.state['maCv'];
    this.maDt = window.history.state['maDt'];
    this.maNhom = window.history.state['maNhom'];

    this.sinhViens = await this.sinhVienService.getSinhvienByDetai(this.maDt);
    await this.getAllBaoCao();
    this.getFileSrc();

    console.log(this.baoCaos);
  }

  async getAllBaoCao() {
    await this.baoCaoService.GetBaocaoByMacv(this.maCv, '').then((res: any) => {
      this.baoCaos = res.map(async (res: any) => {
        let hinh = `../../../../../assets/Images/file_type/doc.png`;
        let splits = res.fileBc.split('|')[0].split('.');
        let type = splits[1];

        if (this.types.includes(type)) {
          hinh = `../../../../../assets/Images/file_type/${type}.png`;
        }

        return {
          ...res,
          hinh,
          tgNop: format(new Date(res.tgNop), 'dd-MM-yyyy HH:mm'),
        };
      });
    });
  }

  getFileSrc() {
    let src = '';

    this.baoCaos.map(async (baoCao) => {
      await axios
        .get(environment.githubHomeworkFilesAPI + baoCao.fileBc)
        .then((response) => {
          src = response.data.download_url;
        });

      return {
        ...baoCao,
        src,
      };
    });
  }
}
