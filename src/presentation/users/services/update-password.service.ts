import { encriptAdapter } from '../../../config';
import { User } from '../../../data/postgres/models/user.model';
import { CustomError } from '../../../domain';
import { UpdatePasswordDto } from '../../../domain/dtos/users/change-password.dto';

export class UpdatePasswordService {
  async execute(userId: string, dataDto: UpdatePasswordDto) {
    const { password, newPassword } = dataDto;

    if (password === newPassword) {
      throw CustomError.badRequest(
        'New password must be different from the old password'
      );
    }

    const user = await this.ensureUserExists(userId);

    this.ensurePasswordIsCorrect(password, user.password);
    const hashedPassword = encriptAdapter.hash(newPassword);
    user.password = hashedPassword;

    try {
      await user.save();
      return {
        message: 'Password updated successfully',
      };
    } catch (error) {
      throw CustomError.internalServer(
        'Something went wrong while updating the password'
      );
    }
  }

  private ensurePasswordIsCorrect(
    unHashedPassword: string,
    hashedPassword: string
  ) {
    const isMatch = encriptAdapter.compare(unHashedPassword, hashedPassword);

    if (!isMatch) {
      throw CustomError.unAutorized('Invalid credentials');
    }
  }

  private async ensureUserExists(userId: string) {
    const user = await User.findOne({
      select: ['id', 'password'],
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
