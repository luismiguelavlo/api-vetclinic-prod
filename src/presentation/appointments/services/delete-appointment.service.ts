import { AppointmentStatus } from '../../../data/postgres/models/appointment.model';
import { CustomError } from '../../../domain';
import { FinderAppointments } from './finder-appointments.service';

export class DeleteAppointmentService {
  constructor(private readonly finderAppointmentService: FinderAppointments) {}

  async execute(appointmentId: string, userId: string) {
    const appointment =
      await this.finderAppointmentService.executeByAppointmentId(
        appointmentId,
        userId
      );

    appointment.status = AppointmentStatus.CANCELED;

    try {
      await appointment.save();
      return {
        message: 'Appointment canceled successfully',
      };
    } catch (error) {
      throw CustomError.internalServer('Something went wrong');
    }
  }
}
