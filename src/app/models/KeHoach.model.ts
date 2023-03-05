export class KeHoach {
    public maKh!: number;
    public tenKh!: string;
    public soLuongDt!: number;
    public thoiGianBd!: string;
    public thoiGianKt!: string;
    public hinhAnh!: string;
    public fileKh!: string;
    public maKhoa!: string;
    public maBm!: string;

    constructor(maKh: number, tenKh: string, soLuongDt: number, thoiGianBd: string, thoiGianKt: string
        , hinhAnh: string, fileKh: string, maKhoa: string, maBm: string){
        this.maKh = maKh;
        this.tenKh = tenKh;
        this.soLuongDt = soLuongDt;
        this.thoiGianBd = thoiGianBd;
        this.thoiGianKt = thoiGianKt;
        this.hinhAnh = hinhAnh;
        this.fileKh = fileKh;
        this.maKhoa = maKhoa;
        this.maBm = maBm;
    }
}