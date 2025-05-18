import { regularExp } from '../../../config';

export class UpdatePasswordDto {
  constructor(public password: string, public newPassword: string) {}

  static execute(object: {
    [key: string]: any;
  }): [string?, UpdatePasswordDto?] {
    const { password, newPassword } = object;

    if (!password) return ['password is required'];
    if (!newPassword) return ['new password is required'];
    if (!regularExp.password.test(newPassword))
      return ['newPassword must be a valid format'];

    return [
      undefined,
      new UpdatePasswordDto(password.trim(), newPassword.trim()),
    ];
  }
}
