import moment from 'moment';
import {
  Appointment,
  AppointmentStatus,
} from '../../../data/postgres/models/appointment.model';
import { CustomError, UpdateAppointmentDto } from '../../../domain';
import { FinderAppointments } from './finder-appointments.service';

export class UpdateAppointmentService {
  constructor(private readonly finderAppointmentService: FinderAppointments) {}

  async execute(
    appointmentId: string,
    userId: string,
    appointmentData: UpdateAppointmentDto
  ) {
    const appointment =
      await this.finderAppointmentService.executeByAppointmentId(
        appointmentId,
        userId,
        AppointmentStatus.PENDING
      );

    const formatDate = moment(appointmentData.date).format(
      'YYYY-MM-DD h:mm:ss'
    );

    await this.ensureAvailabilityAppointment(appointment, formatDate);

    appointment.date = appointmentData.date;
    appointment.reason = appointmentData.reason;

    try {
      return await appointment.save();
    } catch (error) {
      throw CustomError.internalServer('Something went wrong');
    }
  }

  private async ensureAvailabilityAppointment(
    appointmentData: Appointment,
    formatDate: string
  ) {
    const appointment = await Appointment.createQueryBuilder('appointment')
      .where('appointment.doctor_user_id = :userId', {
        userId: appointmentData.user.id,
      })
      .andWhere('appointment.date = :appointmentDate', {
        appointmentDate: formatDate,
      })
      .getOne();

    if (appointment) {
      throw CustomError.badRequest('appointment date already in use');
    }
  }
}
