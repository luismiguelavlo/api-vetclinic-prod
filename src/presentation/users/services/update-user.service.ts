import { protectAccountOwner } from '../../../config';
import { User } from '../../../data/postgres/models/user.model';
import { CustomError, UpdateUserDto } from '../../../domain';

export class UpdateUserService {
  async execute(
    userId: string,
    sessionUserId: string,
    userData: UpdateUserDto
  ) {
    const user = await this.ensureUserExists(userId);

    this.ensureOwner(userId, sessionUserId);

    user.fullname = userData.fullname;
    user.email = userData.email;

    try {
      await user.save();
      return {
        message: 'User updated successfully',
      };
    } catch (error) {
      this.throwException(error);
    }
  }

  private async ensureUserExists(userId: string): Promise<User> {
    const user = await User.findOne({
      select: ['id'],
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

  private async ensureOwner(userId: string, sessionUserId: string) {
    const isOwner = protectAccountOwner(userId, sessionUserId);

    if (!isOwner) {
      throw CustomError.forbiden('You are not the owner of this account');
    }
  }

  private throwException(error: any) {
    if (error.code === '23505') {
      throw CustomError.conflict('Email already in use');
    }

    if (error.code === '22P02') {
      throw CustomError.unprocessableEntity('Invalid data type');
    }

    throw CustomError.internalServer('Error trying to create user');
  }
}
