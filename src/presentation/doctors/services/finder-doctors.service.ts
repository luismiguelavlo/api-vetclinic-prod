import { User, UserRole } from '../../../data/postgres/models/user.model';
import { CustomError } from '../../../domain';

export class FinderDoctorsService {
  async execute(limit: number, offset: number) {
    try {
      const [doctors, total] = await User.findAndCount({
        where: {
          status: true,
          rol: UserRole.DOCTOR,
        },
        select: ['id', 'fullname', 'phone_number', 'email', 'photo_url'],
        take: limit,
        skip: offset,
      });

      return { doctors, total };
    } catch (error: any) {
      throw CustomError.internalServer(error);
    }
  }
}
