import { GiangVienVT } from "./GiangVienVTModel";
import { SinhVienVT } from "./SinhVienVTModel";

export class DeTaiDiemVT {
  public MaDT!: string;
  public TenDT!: number;

  public SinhViens!: SinhVienVT[];
  public GVHDs!: GiangVienVT[];
  public GVPBs!: GiangVienVT[];
  public HoiDongs!: GiangVienVT[];

  constructor() {}
}
