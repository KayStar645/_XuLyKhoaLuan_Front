export class User {
    public Id!: string;
    public Password!: string;

    constructor(userName: string, password: string) {
        this.Id = userName;
        this.Password = password;
    }
}