export class BoMon {
    public maBm!: string;
    public tenBm!: string;
    public sdt!: string;
    public email!: string;
    public maKhoa!: string;

    constructor(maBm: string, tenBm: string, sdt: string, email: string, maKhoa: string) {
        this.maBm = maBm;
        this.tenBm = tenBm;
        this.sdt = sdt;
        this.email = email;
        this.maKhoa = maKhoa;
    }
}