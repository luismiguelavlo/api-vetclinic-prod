import { User, UserRole } from '../../../data/postgres/models/user.model';
import { CustomError } from '../../../domain';

export class DeleteDoctorService {
  async execute(doctorId: string) {
    const doctor = await this.ensureDoctorExists(doctorId);

    doctor.status = false;

    try {
      await doctor.save();
      return {
        message: 'Doctor deleted successfully',
      };
    } catch (error) {
      throw CustomError.internalServer('Something went wrong');
    }
  }

  private async ensureDoctorExists(doctorId: string) {
    const doctor = await User.findOne({
      where: {
        id: doctorId,
        rol: UserRole.DOCTOR,
        status: true,
      },
    });

    if (!doctor) {
      throw CustomError.notFound('Doctor not found');
    }

    return doctor;
  }
}
