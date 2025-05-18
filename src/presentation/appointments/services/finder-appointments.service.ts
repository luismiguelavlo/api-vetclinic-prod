import { protectAccountOwner } from '../../../config';
import {
  Appointment,
  AppointmentStatus,
} from '../../../data/postgres/models/appointment.model';
import { CustomError } from '../../../domain';

export class FinderAppointments {
  async execute(term: string, id: string, status: string) {
    this.ensureEntry(term, status);

    const query = Appointment.createQueryBuilder('appointment');

    if (status !== 'all') {
      query.where(`appointment.status = :status`, { status: status });
    }

    if (term === 'doctor') {
      query.andWhere(`appointment.doctor_user_id = :id`, { id: id });
    }

    if (term === 'pet') {
      query.andWhere(`appointment.pet_id = :id`, { id: id });
    }

    return await query.getMany();
  }

  async executeByUserAuthenticated(userId: string, limit = 10, offset = 0) {
    try {
      const query = Appointment.createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.pet', 'pet')
        .where('pet.user.id = :userId', { userId })
        .orderBy('appointment.date', 'DESC')
        .take(limit)
        .skip(offset);

      const [appointments, total] = await query.getManyAndCount();

      return { appointments, total };
    } catch (error) {
      throw CustomError.internalServer('Error fetching appointments');
    }
  }

  async executeByAppointmentId(
    id: string,
    userId: string,
    status: string = 'all'
  ) {
    const query = Appointment.createQueryBuilder('appointment')
      .leftJoinAndSelect('appointment.pet', 'pet')
      .leftJoin('pet.user', 'owner')
      .leftJoin('appointment.user', 'doctor')
      .leftJoinAndSelect('doctor.speciality', 'speciality')
      .addSelect([
        'doctor.id',
        'doctor.fullname',
        'doctor.photo_url',
        'doctor.phone_number',
        'owner.id',
        'owner.fullname',
        'owner.photo_url',
        'owner.phone_number',
      ])
      .where('appointment.id = :id', { id });

    if (status !== 'all') {
      query.andWhere('appointment.status = :status', { status });
    }

    const appointment = await query.getOne();

    if (!appointment) {
      throw CustomError.notFound('Appointment not found');
    }

    const isOwner = protectAccountOwner(appointment?.pet.user.id, userId);

    if (!isOwner) {
      throw CustomError.forbiden('You are not the owner of this appointment');
    }

    return appointment;
  }

  private ensureEntry(term: string, status: string) {
    if (!['doctor', 'pet'].includes(term)) {
      throw CustomError.badRequest('Term must be doctor or pet');
    }

    if (!['pending', 'completed', 'canceled', 'all'].includes(status)) {
      throw CustomError.badRequest(
        'Status must be: pending, completed, canceled'
      );
    }
  }
}
