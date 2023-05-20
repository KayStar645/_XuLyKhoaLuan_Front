import { HoiDongVT } from './HoiDongVTModel';
import { DeTai } from '../DeTai.model';
import { GiangVienVT } from './GiangVienVTModel';

export class TL_HoiDongVT {
  public hoiDong: HoiDongVT;
  public deTais: DeTai[] = [];

  constructor() {
    this.hoiDong = new HoiDongVT();
  }

  initHoiDong(
    maHD: string,
    tenHD: string,
    ngayLap: string,
    thoiGianBD: string,
    thoiGianKT: string,
    diaDiem: string,
    maBm: string,
    chuTich: GiangVienVT,
    thuKy: GiangVienVT,
    uyViens: GiangVienVT[]
  ) {
    this.hoiDong.init(
      maHD,
      tenHD,
      ngayLap,
      thoiGianBD,
      thoiGianKT,
      diaDiem,
      maBm,
      chuTich,
      thuKy,
      uyViens
    );
  }

  initDeTais() {}
}
