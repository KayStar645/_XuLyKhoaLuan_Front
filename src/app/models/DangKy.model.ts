export class DangKy {
    public maNhom!: number;
    public maDt!: string;
    public ngayDk!: string;
    public ngayGiao!: string;
    public ngayBd!: string;
    public ngayKt!: string;

    constructor(maNhom: number, maDt: string, ngayDk: string, ngayGiao: string, 
        ngayBd: string, ngayKt: string){
        this.maNhom = maNhom;
        this.maDt = maDt;
        this.ngayDk = ngayDk;
        this.ngayGiao = ngayGiao;
        this.ngayBd = ngayBd;
        this.ngayKt = ngayKt;
    }
}