export class Nhom {
    public maNhom!: string;
    public tenNhom!: string;

    constructor(){}

    public init(maNhom: string, tenNhom: string) {
        this.maNhom = maNhom;
        this.tenNhom = tenNhom;
    }
}