import { GiangVienVT } from "./GiangVienVTModel";

export class DetaiVT {
  public MaDT!: string;
  public TenDT!: string;
  public TomTat!: string;
  public SLMin!: number;
  public SLMax!: number;
  public TrangThai!: string;
  public NamHoc!: string;
  public Dot!: number;
  public duyetDT!: string;
  public ngayDuyet!: string;

  public CnPhuHop!: string;
  public GVRD: GiangVienVT[] = [];
  public GVHD: GiangVienVT[] = [];
  public GVPB: GiangVienVT[] = [];

  constructor() {}
}
