import { encriptAdapter } from '../../../config';
import { generatePassword } from '../../../config/generate-random-password';
import { Speciality } from '../../../data/postgres/models/speciality.model';
import { User, UserRole } from '../../../data/postgres/models/user.model';
import { CreateDoctorDto, CustomError } from '../../../domain';
import { FinderUserService } from '../../users/services/finder-user.service';

export class CreatorDoctorService {
  constructor(private readonly finderUserSerice: FinderUserService) {}

  async execute(createDoctorDto: CreateDoctorDto) {
    const { email, fullname, phone_number, specialityId } = createDoctorDto;

    const speciality = await this.ensureSpecialityExist(specialityId);

    const password = generatePassword();
    const encriptedPassword = encriptAdapter.hash(password);

    const user = new User();

    user.fullname = fullname;
    user.email = email;
    user.phone_number = phone_number;
    user.password = encriptedPassword;
    user.rol = UserRole.DOCTOR;
    user.speciality = speciality;

    try {
      await user.save();
      return {
        message: 'Doctor created successfully',
        password,
      };
    } catch (error: any) {
      throw CustomError.internalServer(error);
    }
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
