export class CreateAppointmentDto {
  constructor(
    public readonly date: Date,
    public readonly reason: string,
    public readonly userId: string,
    public readonly petId: string
  ) {}

  static execute(object: {
    [key: string]: any;
  }): [string?, CreateAppointmentDto?] {
    const { date, reason, userId, petId } = object;

    if (!date) return ['Date is required'];
    if (!reason) return ['Reason is required'];
    if (!userId) return ["Doctor's userId is required"];
    if (!petId) return ['Pet is required'];

    return [undefined, new CreateAppointmentDto(date, reason, userId, petId)];
  }
}
