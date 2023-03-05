export class Khoa {
    public maKhoa!: string;
    public tenKhoa!: string;
    public sdt!: string;
    public email!: string;
    public phong!: string;

    constructor(maKhoa: string, tenKhoa: string, sdt: string, email: string, phong: string){
        this.maKhoa = maKhoa;
        this.tenKhoa = tenKhoa;
        this.sdt = sdt;
        this.email = email;
        this.phong = phong;
    }
}