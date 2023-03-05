export class SinhVien {
    public maSv!: string;
    public tenSv!: string;
    public ngaySinh!: string;
    public gioiTinh!: string;
    public lop!: string;
    public sdt!: string;
    public email!: string;
    public maCn!: string;

    constructor(maSv: string, tenSv: string, ngaySinh: string, gioiTinh: string, lop: string
        , sdt: string, email: string, maCn: string) {
        this.maSv = maSv;
        this.tenSv = tenSv;
        this.ngaySinh = ngaySinh;
        this.gioiTinh = gioiTinh;
        this.lop = lop;
        this.sdt = sdt;
        this.email = email;
        this.maCn = maCn;
    }
}