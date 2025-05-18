import { regularExp } from '../../../config';

export class UpdateDoctorDto {
  constructor(
    public readonly specialityId: string,
    public readonly fullname: string,
    public readonly phone_number: string
  ) {}

  static execute(object: { [key: string]: any }): [string?, UpdateDoctorDto?] {
    const { specialityId, fullname, phone_number } = object;

    if (!fullname) return ['fullname is required'];
    if (!phone_number) return ['phone_number is required'];
    if (!specialityId) return ['missing speciality'];

    return [
      undefined,
      new UpdateDoctorDto(specialityId, fullname, phone_number),
    ];
  }
}
