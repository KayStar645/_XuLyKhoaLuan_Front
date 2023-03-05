export class HoiDong {
    public maHd!: string;
    public tenHd!: string;
    public ngayLap!: string;
    public ngayBaoVe!: string;
    public diaDiem!: string;
    public maBm!: string;


    constructor(maHd: string, tenHd: string, ngayLap: string, ngayBaoVe: string
        , diaDiem: string, maBm: string){
        this.maHd = maHd;
        this.tenHd = tenHd;
        this.ngayLap = ngayLap;
        this.ngayBaoVe = ngayBaoVe;
        this.diaDiem = diaDiem;
        this.maBm = maBm;
    }
}