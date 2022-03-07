export class Employee {
  constructor(
    public name: string,
    public email: string,
    public phoneNumber: string,
    public roles: { [key: string]: boolean },
    public id: string
  ) {}
}
