import { regularExp } from '../../../config';

export class CreateDoctorDto {
  constructor(
    public readonly specialityId: string,
    public readonly fullname: string,
    public readonly email: string,
    public readonly phone_number: string
  ) {}

  static execute(object: { [key: string]: any }): [string?, CreateDoctorDto?] {
    const { specialityId, fullname, email, phone_number } = object;

    if (!fullname) return ['fullname is required'];
    if (!email) return ['email is required'];
    if (!regularExp.email.test(email)) return ['email is invalid'];
    if (!phone_number) return ['phone_number is required'];
    if (!specialityId) return ['missing speciality'];

    return [
      undefined,
      new CreateDoctorDto(specialityId, fullname, email, phone_number),
    ];
  }
}
