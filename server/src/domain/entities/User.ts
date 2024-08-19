export class UserType {
  constructor(
    public readonly email?: string,
    public readonly username?: string,
    public readonly password?: string,
    public readonly id?: string,
    public readonly phone?: string
  ) {}
}
