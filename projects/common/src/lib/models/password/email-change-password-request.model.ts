export class EmailChangePasswordRequestModel {
    password: string;

    constructor(password: string, secretKey: string) {
        this.password = password;
        this.secretKey = secretKey;
    }

    secretKey: string;


}
