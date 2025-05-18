export class UpdateAppointmentDto {
  constructor(public readonly date: Date, public readonly reason: string) {}

  static execute(object: {
    [key: string]: any;
  }): [string?, UpdateAppointmentDto?] {
    const { date, reason, userId, petId } = object;

    if (!date) return ['Date is required'];
    if (!reason) return ['Reason is required'];

    return [undefined, new UpdateAppointmentDto(date, reason)];
  }
}
