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
      relations: ['speciality'],
      select: [
        'id',
        'fullname',
        'email',
        'phone_number',
        'photo_url',
        'speciality',
      ],
    });

    if (!user) {
      CustomError.badRequest('El usuario seleccioado debe ser doctor.');
    }

    return user;
  }
}
