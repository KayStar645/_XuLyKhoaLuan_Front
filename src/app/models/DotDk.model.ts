import { format } from 'date-fns';

export class DotDk {
   public namHoc!: string;
   public dot!: number;
   public ngayBd!: string;
   public ngayKt!: string;
   public tgbddk!: string;
   public tgktdk!: string;

   constructor() {}

   public init(
      namHoc: string,
      dot: number,
      ngayBd: string,
      ngayKt: string,
      tgbddk: string,
      tgktdk: string
   ) {
      this.namHoc = namHoc;
      this.dot = dot;
      this.ngayBd = ngayBd;
      this.ngayKt = ngayKt;
      this.tgbddk = tgbddk;
      this.tgktdk = tgktdk;
   }
}
