import { CreateMedicalHistoryDto, CustomError } from '../../../domain';
import { Pet } from '../../../data/postgres/models/pet.model';
import {
  Appointment,
  AppointmentStatus,
} from '../../../data/postgres/models/appointment.model';
import { MedicalHistory } from '../../../data/postgres/models/medical-history.model';

export class CreatorMedicalHistoryService {
  async execute(createMedicalHistoryDto: CreateMedicalHistoryDto) {
    const {
      symptoms,
      diagnosis,
      treatment,
      consultationDate,
      petId,
      appointmentId,
      medications,
      recommendations,
    } = createMedicalHistoryDto;

    const pet = await this.ensurePetExists(petId);
    const appointment = await this.ensureAppointmentIsPending(appointmentId);

    const medicalHistory = new MedicalHistory();

    medicalHistory.symptoms = symptoms;
    medicalHistory.diagnosis = diagnosis;
    medicalHistory.treatment = treatment;
    medicalHistory.consultation_date = consultationDate;
    medicalHistory.pet = pet;
    medicalHistory.appointment = appointment;
    medicalHistory.medications = medications || '';
    medicalHistory.recommendations = recommendations || '';

    try {
      await medicalHistory.save();
      return {
        message: 'Medical history created successfully',
      };
    } catch (error: any) {
      throw CustomError.internalServer(error);
    }
  }

  private async ensurePetExists(petId: string): Promise<Pet> {
    const pet = await Pet.findOne({
      where: { id: petId },
    });

    if (!pet) {
      throw CustomError.badRequest('Pet not found');
    }

    if (!pet.status) {
      throw CustomError.badRequest('Pet is inactive');
    }

    return pet;
  }

  private async ensureAppointmentIsPending(
    appointmentId: string
  ): Promise<Appointment> {
    const appointment = await Appointment.findOne({
      where: { id: appointmentId },
    });

    if (!appointment) {
      throw CustomError.badRequest('Appointment not found');
    }

    if (appointment.status !== AppointmentStatus.PENDING) {
      throw CustomError.badRequest('Appointment is not pending');
    }

    return appointment;
  }
}
