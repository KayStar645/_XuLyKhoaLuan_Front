import { GiangVienVT } from "./GiangVienVTModel";

export class HoiDongVT {
  public maHD!: string;
  public tenHD!: string;
  public ngayLap!: string;
  public thoiGianBD!: string;
  public thoiGianKT!: string;
  public diaDiem!: string;
  public maBm!: string;

  public chuTich!: GiangVienVT;
  public thuKy!: GiangVienVT;
  public uyViens!: GiangVienVT[];

  constructor() {}

  init(
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
    this.maHD = maHD;
    this.tenHD = tenHD;
    this.ngayLap = ngayLap;
    this.thoiGianBD = thoiGianBD;
    this.thoiGianKT = thoiGianKT;
    this.diaDiem = diaDiem;
    this.maBm = maBm;
    this.chuTich = chuTich;
    this.thuKy = thuKy;
    this.uyViens = uyViens;
  }
}
