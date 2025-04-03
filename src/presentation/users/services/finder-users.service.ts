import { User } from '../../../data/postgres/models/user.model';
import { CustomError } from '../../../domain';

export class FinderUsersService {
  async execute() {
    try {
      return await User.find({
        select: ['id', 'fullname', 'email', 'phone_number', 'rol'],
        where: {
          status: true,
        },
      });
    } catch (error) {
      throw CustomError.internalServer('Error trying to find users');
    }
  }
}
