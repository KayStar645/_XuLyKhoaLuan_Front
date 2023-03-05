export class TruongBm {
    public maBm!: string;
    public maGv!: string;
    public ngayNhanChuc!: string;
    public ngayNghi!: string;

    constructor(maBm: string, maGv: string, ngayNhanChuc: string, ngayNghi: string) {
        this.maBm = maBm;
        this.maGv = maGv;
        this.ngayNhanChuc = ngayNhanChuc;
        this.ngayNghi = ngayNghi;
    }
}