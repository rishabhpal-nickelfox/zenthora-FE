export class CurrencyModel {
    id: number;
    code: string;
    name?: string;


    constructor(obj: {id: number, code: string, name?: string}) {
        this.id = obj.id;
        this.code = obj.code;
        this.name = obj.name;
    }

    get stringValue(): string {
        return this.name ? this.name : this.code;
    }
}
