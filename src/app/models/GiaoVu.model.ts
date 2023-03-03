export class GiaoVu {
    public maGv!: string;
    public tenGv!: string;
    public ngayNhanViec!: string;
    public ngayNghi!: string;
    public ngaySinh!: string;
    public gioiTinh!: string;
    public email!: string;
    public sdt!: string;
    public maKhoa!: string;

    constructor(maGv: string, tenGv: string, gioiTinh: string, ngaySinh: string, sdt: string,
        email: string, ngayNhanViec: string, ngayNghi: string, maKhoa: string) {
        this.maGv = maGv;
        this.tenGv = tenGv;
        this.gioiTinh = gioiTinh;
        this.ngaySinh = ngaySinh;
        this.sdt = sdt;
        this.email = email;
        this.ngayNhanViec = ngayNhanViec;
        this.ngayNghi = ngayNghi;
        this.maKhoa = maKhoa;
    }
}