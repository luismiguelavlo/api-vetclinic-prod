export class CreateMedicalHistoryDto {
  constructor(
    public readonly symptoms: string,
    public readonly diagnosis: string,
    public readonly treatment: string,
    public readonly consultationDate: Date,
    public readonly petId: string,
    public readonly appointmentId: string,
    public readonly medications?: string,
    public readonly recommendations?: string
  ) {}

  static execute(object: {
    [key: string]: any;
  }): [string?, CreateMedicalHistoryDto?] {
    const {
      symptoms,
      diagnosis,
      treatment,
      consultationDate,
      petId,
      appointmentId,
      medications,
      recommendations,
    } = object;

    if (!symptoms) return ['symptoms is required'];
    if (!diagnosis) return ['diagnosis is required'];
    if (!treatment) return ['treatment is required'];
    if (!consultationDate) return ['consultationDate is required'];
    if (!petId) return ['petId is required'];
    if (!appointmentId) return ['appointmentId is required'];

    return [
      undefined,
      new CreateMedicalHistoryDto(
        symptoms,
        diagnosis,
        treatment,
        new Date(consultationDate),
        petId,
        appointmentId,
        medications,
        recommendations
      ),
    ];
  }
}
