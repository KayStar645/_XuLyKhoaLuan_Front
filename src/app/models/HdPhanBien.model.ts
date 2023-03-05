export class HdPhanBien {
    public maGv!: number;
    public maHd!: string;
    public maDt!: string;
    public diem!: number;

    constructor(maGv: number, maHd: string, maDt: string, diem: number){
        this.maGv = maGv;
        this.maHd = maHd;
        this.maDt = maDt;
        this.diem = diem;
    }
}