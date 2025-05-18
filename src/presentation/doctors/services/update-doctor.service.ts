import { Speciality } from '../../../data/postgres/models/speciality.model';
import { User, UserRole } from '../../../data/postgres/models/user.model';
import { CustomError, UpdateDoctorDto } from '../../../domain';

export class UpdateDoctorService {
  async execute(doctorId: string, updateDoctorDto: UpdateDoctorDto) {
    const speciality = await this.ensureSpecialityExist(
      updateDoctorDto.specialityId
    );

    const doctor = await this.ensureDoctorExists(doctorId);

    doctor.fullname = updateDoctorDto.fullname;
    doctor.phone_number = updateDoctorDto.phone_number;
    doctor.speciality = speciality;

    try {
      await doctor.save();
      return {
        message: 'Doctor updated successfully',
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
      },
    });

    if (!doctor) {
      throw CustomError.notFound('Doctor not found');
    }

    return doctor;
  }

  private async ensureSpecialityExist(specialityId: string) {
    const speciality = await Speciality.findOne({
      where: {
        id: specialityId,
      },
    });

    if (!speciality) {
      throw CustomError.badRequest('Speciality not found');
    }

    return speciality;
  }
}
