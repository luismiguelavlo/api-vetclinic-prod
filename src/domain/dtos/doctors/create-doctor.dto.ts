export class CreateDoctorDto {
  constructor(
    public readonly speciality: string,
    public readonly user_id: string
  ) {}

  static execute(object: { [key: string]: any }): [string?, CreateDoctorDto?] {
    const { speciality, user_id } = object;

    if (!speciality) return ['missing speciality'];
    if (!user_id) return ['missing user_id'];

    return [undefined, new CreateDoctorDto(speciality, user_id)];
  }
}
