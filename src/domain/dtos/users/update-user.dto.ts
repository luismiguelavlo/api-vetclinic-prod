import { regularExp } from '../../../config';

export class UpdateUserDto {
  constructor(public fullname: string, public email: string) {}

  static execute(object: { [key: string]: any }): [string?, UpdateUserDto?] {
    const { fullname, email } = object;

    if (!fullname) return ['fullname is required'];
    if (!email) return ['email is required'];
    if (!regularExp.email.test(email)) return ['email is invalid'];

    return [
      undefined,
      new UpdateUserDto(
        fullname.trim().toLowerCase(),
        email.trim().toLowerCase()
      ),
    ];
  }
}
