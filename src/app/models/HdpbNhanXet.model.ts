export class HdpbNhanXet {
    public id!: number;
    public thoiGian!: string;
    public noiDung!: string;
    public maGv!: string;
    public maHd!: string;
    public maDt!: string;

    constructor(id: number, thoiGian: string, noiDung: string, maGv: string, maHd: string, maDt: string){
        this.id = id;
        this.thoiGian = thoiGian;
        this.noiDung = noiDung;
        this.maGv = maGv;
        this.maHd = maHd;
        this.maDt = maDt;
    }
}