export class TruongKhoa {
    public maKhoa!: string;
    public maGv!: string;
    public ngayNhanChuc!: string;
    public ngayNghi!: string;

    constructor(maKhoa: string, maGv: string, ngayNhanChuc: string, ngayNghi: string) {
        this.maKhoa = maKhoa;
        this.maGv = maGv;
        this.ngayNhanChuc = ngayNhanChuc;
        this.ngayNghi = ngayNghi;
    }
}