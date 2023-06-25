export class newUser {
   public userName!: string;
   public oldPassword!: string;
   public newPassword!: string;

   constructor(userName: string, oldPassword: string, newPassword: string) {
      this.userName = userName;
      this.oldPassword = oldPassword;
      this.newPassword = newPassword;
   }
}
