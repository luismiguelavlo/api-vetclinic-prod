import { User } from '../../../data/postgres/models/user.model';
import { CustomError } from '../../../domain';

export class FinderUserService {
  async execute(userId: string) {
    const user = await User.findOne({
      select: ['id', 'fullname', 'email', 'phone_number', 'rol'],
      where: {
        id: userId,
        status: true,
      },
    });

    if (!user) {
      throw CustomError.notFound(`User with id: ${userId} not found`);
    }

    return user;
  }
}
