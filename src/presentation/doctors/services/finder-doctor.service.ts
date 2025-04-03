import { Doctor } from '../../../data/postgres/models/doctor.model';
import { User, UserRole } from '../../../data/postgres/models/user.model';
import { CustomError } from '../../../domain';

export class FinderDoctorService {
  async execute(userId: string) {
    const user = await User.findOne({
      where: {
        id: userId,
        rol: UserRole.DOCTOR,
        status: true,
      },
    });

    if (!user) {
      CustomError.badRequest('El usuario seleccioado debe ser doctor.');
    }

    return user;
  }
}
